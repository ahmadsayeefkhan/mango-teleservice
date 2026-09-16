"use client";

import { useEffect, useState } from "react";
import { latLonToVec3 } from "./geo";
import * as THREE from "three";

export type LandDots = {
  /** xyz per dot on a unit sphere (slightly lifted so the dots sit above the ocean). */
  positions: Float32Array;
  /** 0 = land, 1 = Bangladesh */
  flags: Float32Array;
  count: number;
};

const DOT_RADIUS = 1.003;
const cache = new Map<string, Promise<LandDots>>();

/** Parses the compact binary written by scripts/build-land-dots.mjs. */
function parse(buf: ArrayBuffer): LandDots {
  const view = new DataView(buf);
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  if (magic !== "MGLD") throw new Error("land-dots: bad magic");
  const count = view.getUint32(4, true);
  const positions = new Float32Array(count * 3);
  const flags = new Float32Array(count);
  const latOff = 8;
  const lonOff = 8 + count * 2;
  const flagOff = 8 + count * 4;
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const lat = view.getInt16(latOff + i * 2, true) / 300;
    const lon = view.getInt16(lonOff + i * 2, true) / 180;
    latLonToVec3(lat, lon, DOT_RADIUS, v);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
    flags[i] = view.getUint8(flagOff + i);
  }
  return { positions, flags, count };
}

export function loadLandDots(url: string): Promise<LandDots> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`land-dots: ${r.status}`);
        return r.arrayBuffer();
      })
      .then(parse);
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return p;
}

/** Loads (and module-caches) the dot dataset. Pass `null` to skip loading. */
export function useLandDots(url: string | null) {
  const [data, setData] = useState<LandDots | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    loadLandDots(url)
      .then((d) => alive && setData(d))
      .catch((e: unknown) => alive && setError(e instanceof Error ? e : new Error(String(e))));
    return () => {
      alive = false;
    };
  }, [url]);
  return { data, error };
}
