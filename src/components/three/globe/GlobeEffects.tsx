"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { EffectComposer as EffectComposerImpl } from "postprocessing";

/**
 * Collect every three.js Material reachable from the composer's passes: EffectPass materials,
 * plus the internal passes an Effect owns (Bloom = luminance + mipmap down/upsampling).
 */
function collectMaterials(root: unknown, out: Set<THREE.Material>, depth = 0, seen = new Set<object>()) {
  if (!root || typeof root !== "object" || depth > 7 || seen.has(root)) return;
  seen.add(root);
  if (root instanceof THREE.Material) {
    out.add(root);
    return;
  }
  if (root instanceof THREE.Mesh) {
    const m = root.material;
    (Array.isArray(m) ? m : [m]).forEach((x) => x && out.add(x));
    return;
  }
  if (
    root instanceof THREE.WebGLRenderer ||
    root instanceof THREE.Scene ||
    root instanceof THREE.Camera ||
    root instanceof THREE.Texture ||
    root instanceof THREE.WebGLRenderTarget ||
    root instanceof THREE.BufferGeometry ||
    ArrayBuffer.isView(root)
  )
    return;
  const values = Array.isArray(root) ? root : root instanceof Map ? Array.from(root.values()) : root instanceof Set ? Array.from(root) : Object.values(root as Record<string, unknown>);
  for (const v of values) collectMaterials(v, out, depth + 1, seen);
}

/**
 * postprocessing draws its fullscreen passes with a position-only triangle (no normals), and three
 * keys shader programs on the geometry's attributes (`hasPositionAttribute`, `vertexNormals`), so
 * the throwaway meshes used to warm the programs must use the same kind of geometry or a different
 * program variant gets compiled and the real first frame still links from scratch.
 */
const fullscreenTriangle = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));

/**
 * Threshold bloom: only the HDR mango elements (beacon, Bangladesh dots, arc
 * pulses, nodes) exceed the luminance threshold, so the mist dots and the
 * ocean stay crisp. Loaded lazily and only on the "high" tier.
 *
 * `onCompiled` fires once every pass material has been compiled asynchronously
 * (KHR_parallel_shader_compile via three's compileAsync), so the composer's first
 * real frame finds its ~10 programs in the cache instead of linking them on the
 * main thread (200–400ms on a laptop, right after the hero reveal).
 */
export default function GlobeEffects({ onCompiled }: { onCompiled?: () => void }) {
  const { gl, camera } = useThree();
  const started = useRef(false);

  // The composer is created in an effect and handed out through the ref on a later commit, so a
  // callback ref (not a mount effect) is the reliable hook. Passes are attached in the same commit;
  // a zero-delay timeout lets that commit finish, and we poll briefly in case they land later.
  const composerRef = useCallback(
    (composer: EffectComposerImpl | null) => {
      if (!composer || started.current) return;
      started.current = true;
      const done = () => onCompiled?.();
      const attempt = (n: number) => {
        const materials = new Set<THREE.Material>();
        collectMaterials(composer.passes, materials);
        if (materials.size === 0 && n < 20) {
          setTimeout(() => attempt(n + 1), 16);
          return;
        }
        if (materials.size === 0) {
          done();
          return;
        }
        // One throwaway mesh per material: three caches programs per material parameters, so
        // compiling here warms exactly the programs the composer will use. The parameters include
        // the *bound render target* (outputColorSpace differs when drawing into a framebuffer), so
        // compile once with a target bound (bloom's internal passes) and once without (the final
        // pass that draws to the canvas).
        const dummy = new THREE.Scene();
        materials.forEach((m) => {
          const mesh = new THREE.Mesh(fullscreenTriangle, m);
          mesh.frustumCulled = false;
          dummy.add(mesh);
        });
        const target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false });
        const prev = gl.getRenderTarget();
        gl.setRenderTarget(target);
        const offscreen = gl.compileAsync(dummy, camera); // compile() itself is synchronous; only readiness polling is deferred
        gl.setRenderTarget(null);
        const onscreen = gl.compileAsync(dummy, camera);
        gl.setRenderTarget(prev);
        Promise.all([offscreen, onscreen])
          .then(done, done)
          .finally(() => target.dispose());
      };
      setTimeout(() => attempt(0), 0);
    },
    [gl, camera, onCompiled],
  );

  return (
    <EffectComposer ref={composerRef} multisampling={4} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.62} luminanceSmoothing={0.18} radius={0.72} />
    </EffectComposer>
  );
}
