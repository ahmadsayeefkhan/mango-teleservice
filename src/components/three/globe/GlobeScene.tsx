"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { COLORS, DHAKA, MAX_ARCS, ROUTES } from "./constants";
import { GreatArcCurve, clamp01, easeOutCubic, latLonToVec3 } from "./geo";
import type { LandDots } from "./useLandDots";
import {
  arcFrag,
  arcVert,
  beaconFrag,
  beaconVert,
  dotsFrag,
  dotsVert,
  globeFrag,
  globeVert,
  haloFrag,
  haloVert,
  nodeFrag,
  nodeVert,
} from "./shaders";

export type GlobeVariant = "hero" | "network";

export type GlobeSceneProps = {
  variant: GlobeVariant;
  tier: "high" | "lite";
  /** Reduced motion / ?static=1: one frame, no idle rotation or pulses. */
  staticMode: boolean;
  scrollProgress?: RefObject<number>;
  data: LandDots;
  /** Lat step of the loaded dataset (degrees) — sizes dots relative to spacing. */
  stepDeg: number;
  showLabels: boolean;
  onFirstFrame?: () => void;
};

/* --------------------------------------------------------------- framing */

type Framing = {
  /** Globe centre as a fraction of the container (x → right, y → down). */
  cx: number;
  cy: number;
  /** Globe radius as a fraction of the container's shorter side. */
  radius: number;
  /** Where Dhaka sits relative to the globe's screen centre (degrees). */
  yaw: number;
  pitch: number;
  /** Deltas applied at scrollProgress = 1. */
  scrollYaw: number;
  scrollPitch: number;
  scrollZoom: number;
};

function getFraming(variant: GlobeVariant, aspect: number): Framing {
  const portrait = aspect < 0.9;
  const squarish = aspect < 1.25;
  if (variant === "network") {
    if (portrait) return { cx: 0.72, cy: 0.06, radius: 1.05, yaw: -18, pitch: -18, scrollYaw: 26, scrollPitch: 4, scrollZoom: 0.9 };
    if (squarish) return { cx: 0.74, cy: 0.80, radius: 0.72, yaw: -22, pitch: 24, scrollYaw: 30, scrollPitch: -6, scrollZoom: 0.9 };
    return { cx: 0.80, cy: 0.80, radius: 0.82, yaw: -25, pitch: 25, scrollYaw: 32, scrollPitch: -6, scrollZoom: 0.88 };
  }
  // Portrait: the globe is a band across the top (centre just above the viewport, Dhaka
  // below it); the wrapper fades it out toward the bottom so copy can sit over ink.
  if (portrait) return { cx: 0.74, cy: 0.02, radius: 0.95, yaw: -22, pitch: -20, scrollYaw: 30, scrollPitch: 4, scrollZoom: 0.9 };
  if (squarish) return { cx: 0.76, cy: 0.72, radius: 0.60, yaw: -20, pitch: 26, scrollYaw: 40, scrollPitch: -8, scrollZoom: 0.86 };
  return { cx: 0.80, cy: 0.70, radius: 0.61, yaw: -20, pitch: 27, scrollYaw: 42, scrollPitch: -8, scrollZoom: 0.85 };
}

const FOV = 26;
const DEG = Math.PI / 180;
const ARC_START = 0.25;
const ARC_STAGGER = 0.19;
const ARC_DURATION = 1.25;

/* ----------------------------------------------------------------- scene */

export default function GlobeScene({
  variant,
  tier,
  staticMode,
  scrollProgress,
  data,
  stepDeg,
  showLabels,
  onFirstFrame,
}: GlobeSceneProps) {
  const { size, invalidate } = useThree();
  const dpr = useThree((s) => s.viewport.dpr);

  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const labelEls = useRef<(HTMLSpanElement | null)[]>([]);

  const routes = useMemo(() => ROUTES.filter((r) => !r.networkOnly || variant === "network"), [variant]);

  /* ---- static geometry (memoised, disposed on unmount) ---- */

  const dhakaPos = useMemo(() => latLonToVec3(DHAKA.lat, DHAKA.lon), []);
  const dhakaDir = useMemo(() => dhakaPos.clone().normalize(), [dhakaPos]);
  /** Label anchors in globe-local space: [Dhaka, ...routes]. */
  const labelLocal = useMemo(
    () => [dhakaPos.clone(), ...routes.map((r) => latLonToVec3(r.lat, r.lon))],
    [dhakaPos, routes],
  );

  const dotsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute("aFlag", new THREE.BufferAttribute(data.flags, 1));
    g.computeBoundingSphere();
    return g;
  }, [data]);

  const arcGeo = useMemo(() => {
    const radius = tier === "lite" ? 0.0048 : 0.0036;
    const tubular = tier === "lite" ? 72 : 128;
    const parts = routes.map((r, i) => {
      const curve = new GreatArcCurve(dhakaPos, latLonToVec3(r.lat, r.lon), 1.002);
      const tube = new THREE.TubeGeometry(curve, tubular, radius, 6, false);
      const n = tube.attributes.position.count;
      tube.setAttribute("aArc", new THREE.BufferAttribute(new Float32Array(n).fill(i), 1));
      return tube;
    });
    const merged = mergeGeometries(parts, false);
    parts.forEach((p) => p.dispose());
    return merged;
  }, [routes, dhakaPos, tier]);

  const nodeGeo = useMemo(() => {
    const pos = new Float32Array(routes.length * 3);
    const idx = new Float32Array(routes.length);
    routes.forEach((r, i) => {
      const v = latLonToVec3(r.lat, r.lon, 1.004);
      pos.set([v.x, v.y, v.z], i * 3);
      idx[i] = i;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aIndex", new THREE.BufferAttribute(idx, 1));
    return g;
  }, [routes]);

  const beaconQuat = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(dhakaPos.clone().multiplyScalar(2), dhakaPos, new THREE.Vector3(0, 1, 0));
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, [dhakaPos]);

  useEffect(
    () => () => {
      dotsGeo.dispose();
      arcGeo.dispose();
      nodeGeo.dispose();
    },
    [dotsGeo, arcGeo, nodeGeo],
  );

  /* ---- uniforms ---- */

  const uniforms = useMemo(() => {
    const c = (hex: string) => new THREE.Color(hex);
    return {
      globe: {
        uOceanDark: { value: c(COLORS.oceanDark) },
        uOceanLight: { value: c(COLORS.oceanLight) },
        uRim: { value: c(COLORS.rim) },
        uMango: { value: c(COLORS.mango) },
        uSunDir: { value: new THREE.Vector3(0.35, 0.55, 0.75).normalize() },
        uRimStrength: { value: 0.6 },
      },
      halo: {
        uRim: { value: c(COLORS.rim) },
        uMango: { value: c(COLORS.mango) },
        uInner: { value: 1.08 },
        uSize: { value: 1.6 },
        uStrength: { value: 0.34 },
      },
      dots: {
        uTime: { value: 0 },
        uSize: { value: 3 },
        uRefDist: { value: 1.6 },
        uDhakaDir: { value: dhakaDir },
        uEmphasis: { value: 1 },
        uMist: { value: c(COLORS.mist) },
        uMango: { value: c(COLORS.mango) },
      },
      arcs: {
        uDraw: { value: new Array<number>(MAX_ARCS).fill(0) },
        uTime: { value: 0 },
        uMango: { value: c(COLORS.mango) },
        uPulse: { value: 1 },
      },
      beacon: {
        uTime: { value: 0 },
        uMango: { value: c(COLORS.mango) },
        uIntro: { value: 0 },
      },
      nodes: {
        uDraw: { value: new Array<number>(MAX_ARCS).fill(0) },
        uSize: { value: 8 },
        uRefDist: { value: 1.6 },
        uMango: { value: c(COLORS.mango) },
      },
    };
  }, [dhakaDir]);

  /* ---- interaction state (refs: no re-renders) ---- */

  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (staticMode) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [staticMode]);

  const state = useRef({
    yaw: NaN,
    pitch: NaN,
    radius: NaN,
    introStart: -1,
    firstFrameSent: false,
    draws: new Array<number>(MAX_ARCS).fill(0),
    tmp: new THREE.Vector3(),
    camDir: new THREE.Vector3(),
  });

  // Per-frame writes go through refs to the JSX-created materials (React Compiler safe).
  const haloMat = useRef<THREE.ShaderMaterial>(null);
  const dotsMat = useRef<THREE.ShaderMaterial>(null);
  const arcMat = useRef<THREE.ShaderMaterial>(null);
  const nodeMat = useRef<THREE.ShaderMaterial>(null);
  const beaconMat = useRef<THREE.ShaderMaterial>(null);

  // In static mode, redraw on resize (R3F invalidates on its own, but be explicit).
  useEffect(() => {
    if (staticMode) invalidate();
  }, [staticMode, size, invalidate]);

  useFrame((s, rawDelta) => {
    const g = groupRef.current;
    if (!g) return;
    const dt = Math.min(rawDelta, 1 / 30);
    const t = s.clock.elapsedTime;
    const st = state.current;
    const { width: W, height: H } = size;
    const aspect = W / H;
    const f = getFraming(variant, aspect);

    /* --- targets --- */
    const sp = clamp01(scrollProgress?.current ?? 0);
    let yaw = f.yaw + f.scrollYaw * sp;
    let pitch = f.pitch + f.scrollPitch * sp;
    const radius = f.radius * THREE.MathUtils.lerp(1, f.scrollZoom, sp);
    if (!staticMode) {
      // slow idle drift that always eases back toward Bangladesh
      yaw += 2.4 * Math.sin(t * 0.13);
      pitch += 1.2 * Math.sin(t * 0.09 + 1.3);
      yaw += pointer.current.x * 2.6;
      pitch += -pointer.current.y * 1.6;
    }

    /* --- damping --- */
    if (Number.isNaN(st.yaw)) {
      st.yaw = yaw;
      st.pitch = pitch;
      st.radius = radius;
    } else if (staticMode) {
      st.yaw = yaw;
      st.pitch = pitch;
      st.radius = radius;
    } else {
      st.yaw = THREE.MathUtils.damp(st.yaw, yaw, 2.6, dt);
      st.pitch = THREE.MathUtils.damp(st.pitch, pitch, 2.6, dt);
      st.radius = THREE.MathUtils.damp(st.radius, radius, 2.6, dt);
    }

    /* --- globe orientation: Dhaka faces the camera, then offset so it sits
           `pitch` degrees above and `yaw` degrees left/right of the globe centre --- */
    g.rotation.order = "XYZ";
    g.rotation.set((DHAKA.lat - st.pitch) * DEG, (-DHAKA.lon + st.yaw) * DEG, 0);

    /* --- camera: distance from desired on-screen radius, view offset for placement --- */
    const shorter = Math.min(W, H);
    const radiusPx = st.radius * shorter;
    const tanHalf = Math.tan((FOV / 2) * DEG);
    const theta = Math.atan((radiusPx / (H / 2)) * tanHalf);
    const D = 1 / Math.sin(theta);
    const cam = s.camera as THREE.PerspectiveCamera;
    cam.position.set(0, 0, D);
    cam.lookAt(0, 0, 0);
    cam.fov = FOV;
    cam.aspect = aspect;
    cam.setViewOffset(W, H, W * (0.5 - f.cx), H * (0.5 - f.cy), W, H);
    cam.updateProjectionMatrix();

    /* --- halo billboard --- */
    const inner = D / Math.sqrt(D * D - 1);
    const haloSize = inner + 0.3;
    if (haloRef.current && haloMat.current) {
      haloMat.current.uniforms.uInner.value = inner;
      haloMat.current.uniforms.uSize.value = haloSize;
      haloRef.current.scale.setScalar(haloSize * 2);
    }

    /* --- intro timeline --- */
    if (st.introStart < 0) st.introStart = t;
    const intro = staticMode ? 100 : t - st.introStart;
    const draws = st.draws;
    for (let i = 0; i < MAX_ARCS; i++) {
      const start = ARC_START + i * ARC_STAGGER;
      draws[i] = i < routes.length ? easeOutCubic(clamp01((intro - start) / ARC_DURATION)) : 0;
    }
    const beaconIntro = easeOutCubic(clamp01(intro / 0.9));
    const time = staticMode ? 4.2 : t;

    /* --- dot sizing: ~0.36 × grid spacing, in device pixels --- */
    const heightScale = THREE.MathUtils.clamp(H / 900, 0.85, 1.5);
    const stepRad = stepDeg * DEG;

    if (dotsMat.current) {
      const u = dotsMat.current.uniforms;
      u.uTime.value = time;
      u.uSize.value = Math.max(1.4, 0.36 * stepRad * radiusPx) * dpr;
      u.uRefDist.value = D - 1;
    }
    if (arcMat.current) {
      const u = arcMat.current.uniforms;
      u.uTime.value = time;
      u.uPulse.value = staticMode ? 0 : 1;
      for (let i = 0; i < MAX_ARCS; i++) (u.uDraw.value as number[])[i] = draws[i];
    }
    if (nodeMat.current) {
      const u = nodeMat.current.uniforms;
      u.uSize.value = 9 * dpr * heightScale * (variant === "network" ? 1.15 : 1);
      u.uRefDist.value = D - 1;
      for (let i = 0; i < MAX_ARCS; i++) (u.uDraw.value as number[])[i] = draws[i];
    }
    if (beaconMat.current) {
      beaconMat.current.uniforms.uTime.value = time;
      beaconMat.current.uniforms.uIntro.value = beaconIntro;
    }

    /* --- labels: fade by facing --- */
    if (showLabels) {
      const camDir = st.camDir.copy(cam.position).normalize();
      labelEls.current.forEach((el, i) => {
        if (!el || !labelLocal[i]) return;
        const world = g.localToWorld(st.tmp.copy(labelLocal[i]));
        const facing = world.normalize().dot(camDir);
        const drawn = i === 0 ? beaconIntro : draws[i - 1];
        const o = THREE.MathUtils.smoothstep(facing, 0.28, 0.5) * THREE.MathUtils.smoothstep(drawn, 0.9, 1);
        el.style.opacity = o.toFixed(3);
      });
    }

    if (!st.firstFrameSent) {
      st.firstFrameSent = true;
      // fire after this frame has actually been presented
      requestAnimationFrame(() => requestAnimationFrame(() => onFirstFrame?.()));
    }
  });

  const labelStyle: CSSProperties = {
    fontFamily: "var(--font-jetbrains, var(--font-mono, 'JetBrains Mono', ui-monospace, Menlo, monospace))",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: COLORS.mist,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    userSelect: "none",
    opacity: 0,
    transition: "opacity 0.3s",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transform: "translate(10px, -50%)",
  };

  return (
    <>
      {/* atmosphere halo (billboard behind the globe's rim) */}
      <mesh ref={haloRef} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={haloMat}
          vertexShader={haloVert}
          fragmentShader={haloFrag}
          uniforms={uniforms.halo}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          premultipliedAlpha
        />
      </mesh>

      <group ref={groupRef}>
        {/* ocean sphere with fresnel rim */}
        <mesh renderOrder={0}>
          <sphereGeometry args={[1, tier === "lite" ? 64 : 96, tier === "lite" ? 48 : 72]} />
          <shaderMaterial vertexShader={globeVert} fragmentShader={globeFrag} uniforms={uniforms.globe} />
        </mesh>

        {/* land dots — one draw call */}
        <points geometry={dotsGeo} renderOrder={2} frustumCulled={false}>
          <shaderMaterial
            ref={dotsMat}
            vertexShader={dotsVert}
            fragmentShader={dotsFrag}
            uniforms={uniforms.dots}
            transparent
            depthWrite={false}
          />
        </points>

        {/* network arcs — one draw call */}
        <mesh geometry={arcGeo} renderOrder={3} frustumCulled={false}>
          <shaderMaterial
            ref={arcMat}
            vertexShader={arcVert}
            fragmentShader={arcFrag}
            uniforms={uniforms.arcs}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* destination nodes */}
        <points geometry={nodeGeo} renderOrder={4} frustumCulled={false}>
          <shaderMaterial
            ref={nodeMat}
            vertexShader={nodeVert}
            fragmentShader={nodeFrag}
            uniforms={uniforms.nodes}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            premultipliedAlpha
          />
        </points>

        {/* Dhaka beacon: core, halo and pulsing rings on a surface-tangent quad */}
        <mesh position={dhakaPos.clone().multiplyScalar(1.004)} quaternion={beaconQuat} renderOrder={5}>
          <planeGeometry args={[0.2, 0.2]} />
          <shaderMaterial
            ref={beaconMat}
            vertexShader={beaconVert}
            fragmentShader={beaconFrag}
            uniforms={uniforms.beacon}
            transparent
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            premultipliedAlpha
          />
        </mesh>

        {showLabels && (
          <>
            <Html position={dhakaPos.clone().multiplyScalar(1.02)} zIndexRange={[1, 0]} style={{ pointerEvents: "none" }}>
              <span
                ref={(el) => {
                  labelEls.current[0] = el;
                }}
                style={{ ...labelStyle, color: COLORS.mango }}
              >
                <i style={{ width: 14, height: 2, background: COLORS.mango, display: "inline-block" }} />
                {DHAKA.name}
              </span>
            </Html>
            {routes.map((r, i) => (
              <Html key={r.name} position={latLonToVec3(r.lat, r.lon, 1.02)} zIndexRange={[1, 0]} style={{ pointerEvents: "none" }}>
                <span
                  ref={(el) => {
                    labelEls.current[i + 1] = el;
                  }}
                  style={{
                    ...labelStyle,
                    transform: r.labelSide === "left" ? "translate(calc(-100% - 10px), -50%)" : labelStyle.transform,
                  }}
                >
                  {r.name}
                </span>
              </Html>
            ))}
          </>
        )}
      </group>
    </>
  );
}
