/**
 * build-land-dots.mjs — precomputes the dotted-Earth land samples used by
 * src/components/three/NetworkGlobe.tsx.
 *
 * Samples an equal-area lat/lon grid (longitude step scaled by 1/cos(lat), every
 * other row offset by half a step for a hex-like packing), keeps the samples that
 * fall inside Natural Earth land (world-atlas land-50m) and tags the ones inside
 * Bangladesh (countries-50m, ISO numeric 050). Bangladesh is re-sampled on a much
 * finer grid so it reads as a dense, glowing cluster.
 *
 * Output: public/data/land-dots.bin (full) and public/data/land-dots-lite.bin (mobile)
 *
 *   header  8 bytes   "MGLD" magic (4) + uint32 LE dot count
 *   lat     int16 LE  × count   degrees × 300   (±90°  → ±27000)
 *   lon     int16 LE  × count   degrees × 180   (±180° → ±32400)
 *   flag    uint8     × count   0 = land, 1 = Bangladesh
 *
 * Run:  node scripts/build-land-dots.mjs
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";
import { geoBounds, geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/data");

const landTopo = require("world-atlas/land-50m.json");
const countriesTopo = require("world-atlas/countries-50m.json");

const land = feature(landTopo, landTopo.objects.land);
const countries = feature(countriesTopo, countriesTopo.objects.countries);
const bangladesh = countries.features.find((f) => f.id === "050");
if (!bangladesh) throw new Error("Bangladesh (id 050) not found in countries-50m");

/** Split a Feature / FeatureCollection of (Multi)Polygons into single polygons with a lon/lat bbox for fast rejection. */
function explode(f) {
  const features = f.type === "FeatureCollection" ? f.features : [f];
  const polys = features.flatMap((ft) =>
    ft.geometry.type === "Polygon" ? [ft.geometry.coordinates] : ft.geometry.coordinates,
  );
  return polys.map((coordinates) => {
    const poly = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates } };
    const [[x0, y0], [x1, y1]] = geoBounds(poly);
    return { poly, x0, y0, x1, y1 };
  });
}

function inBox(p, lon, lat) {
  if (lat < p.y0 || lat > p.y1) return false;
  return p.x0 <= p.x1 ? lon >= p.x0 && lon <= p.x1 : lon >= p.x0 || lon <= p.x1;
}

function makeTester(f) {
  const parts = explode(f);
  return (lon, lat) => {
    for (const p of parts) if (inBox(p, lon, lat) && geoContains(p.poly, [lon, lat])) return true;
    return false;
  };
}

const isLand = makeTester(land);
const isBangladesh = makeTester(bangladesh);

/** Equal-area-ish grid sampler. `step` is the latitude step in degrees. */
function sampleGrid(step, test, { latMin = -84, latMax = 84, box } = {}) {
  const out = [];
  let row = 0;
  for (let lat = latMin + step / 2; lat <= latMax; lat += step, row++) {
    if (box && (lat < box.y0 || lat > box.y1)) continue;
    const cos = Math.max(Math.cos((lat * Math.PI) / 180), 1e-3);
    const lonStep = step / cos;
    const n = Math.max(1, Math.round(360 / lonStep));
    const actualStep = 360 / n;
    const offset = row % 2 ? actualStep / 2 : 0;
    for (let i = 0; i < n; i++) {
      let lon = -180 + offset + i * actualStep;
      if (lon > 180) lon -= 360;
      if (box && !inBox(box, lon, lat)) continue;
      if (test(lon, lat)) out.push([lon, lat]);
    }
  }
  return out;
}

const bdParts = explode(bangladesh);
const bdBox = {
  x0: Math.min(...bdParts.map((p) => p.x0)) - 0.2,
  x1: Math.max(...bdParts.map((p) => p.x1)) + 0.2,
  y0: Math.min(...bdParts.map((p) => p.y0)) - 0.2,
  y1: Math.max(...bdParts.map((p) => p.y1)) + 0.2,
};

function build(name, step, bdStep) {
  const t0 = Date.now();
  // Base land grid, minus anything inside Bangladesh (re-sampled densely below).
  const base = sampleGrid(step, (lon, lat) => isLand(lon, lat) && !isBangladesh(lon, lat));
  const bd = sampleGrid(bdStep, isBangladesh, { box: bdBox });
  const count = base.length + bd.length;

  const buf = Buffer.alloc(8 + count * 5);
  buf.write("MGLD", 0, "ascii");
  buf.writeUInt32LE(count, 4);
  const latOff = 8;
  const lonOff = 8 + count * 2;
  const flagOff = 8 + count * 4;
  const all = [...base.map((p) => [p, 0]), ...bd.map((p) => [p, 1])];
  all.forEach(([[lon, lat], flag], i) => {
    buf.writeInt16LE(Math.round(lat * 300), latOff + i * 2);
    buf.writeInt16LE(Math.round(lon * 180), lonOff + i * 2);
    buf.writeUInt8(flag, flagOff + i);
  });
  mkdirSync(OUT_DIR, { recursive: true });
  const file = resolve(OUT_DIR, `${name}.bin`);
  writeFileSync(file, buf);
  console.log(
    `${name}: ${base.length} land + ${bd.length} Bangladesh = ${count} dots, ${(buf.length / 1024).toFixed(1)} KB, ${((Date.now() - t0) / 1000).toFixed(1)}s`,
  );
}

build("land-dots", 0.72, 0.22);
build("land-dots-lite", 1.15, 0.3);
