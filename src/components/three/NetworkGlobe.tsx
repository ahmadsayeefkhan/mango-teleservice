"use client";

/**
 * NetworkGlobe — the signature WebGL element: a dotted night Earth with
 * Bangladesh glowing mango and signal arcs to Mango's real routes.
 *
 * Contract (do not change the signature):
 *   default export NetworkGlobe(props: NetworkGlobeProps)
 *   Client-only: import it with next/dynamic({ ssr: false }).
 *   Fills its parent (give the parent a size, e.g. `absolute inset-0`).
 *   Transparent canvas — the host section is expected to be ink (#0E1116).
 *
 * Behaviour
 *   - Static image fallback (/images/hero-network-globe.png) is shown first and
 *     when WebGL is unavailable, the context is lost, or the scene errors.
 *   - Canvas fades in over the image once the first frame has been presented.
 *   - Rendering pauses when offscreen (IntersectionObserver) or the tab is hidden.
 *   - Low-power devices get fewer dots, lower dpr and no post-processing.
 *   - prefers-reduced-motion or ?static=1 renders one static frame.
 */
import Image from "next/image";
import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DATASETS, FALLBACK_IMAGE } from "./globe/constants";
import { useLandDots } from "./globe/useLandDots";
import GlobeScene from "./globe/GlobeScene";

const GlobeEffects = lazy(() => import("./globe/GlobeEffects"));

export type NetworkGlobeProps = {
  className?: string;
  /** 0 → 1 scroll progress of the host section, written by the host's ScrollTrigger. */
  scrollProgress?: RefObject<number>;
  /** "hero" = Home hero framing; "network" = closer framing for the Network page. */
  variant?: "hero" | "network";
  /**
   * Render the still-image fallback inside this component (default true). Hosts that already show
   * the same image underneath pass `false`, so mounting the globe never inserts a second <img>
   * (which would register a new, later Largest Contentful Paint candidate).
   */
  fallback?: boolean;
};

/**
 * Compiles every material in the scene with `KHR_parallel_shader_compile` before the render loop
 * starts. Without this, the first `render()` links all shaders synchronously — 200–400ms of main
 * thread on a laptop, right after the hero reveal.
 */
function Precompile({ onDone }: { onDone: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let live = true;
    // With post-processing on, the scene is drawn into the composer's framebuffer, which selects a
    // different program variant (outputColorSpace) than drawing to the canvas: compile both.
    const target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: true });
    const prev = gl.getRenderTarget();
    gl.setRenderTarget(target);
    const offscreen = gl.compileAsync(scene, camera);
    gl.setRenderTarget(null);
    const onscreen = gl.compileAsync(scene, camera);
    gl.setRenderTarget(prev);
    const done = () => {
      // One warm draw into the tiny target uploads geometry/uniform buffers ahead of the first
      // visible frame (~20ms, well under the long-task threshold).
      if (live) {
        gl.setRenderTarget(target);
        gl.render(scene, camera);
        gl.setRenderTarget(null);
      }
      target.dispose();
      if (live) onDone();
    };
    Promise.all([offscreen, onscreen]).then(done, done);
    return () => {
      live = false;
    };
  }, [gl, scene, camera, onDone]);
  return null;
}

type Capabilities = {
  webgl: boolean;
  tier: "high" | "lite";
  staticMode: boolean;
  /** Post-processing bloom (high tier only; `?fx=0` disables it for A/B checks). */
  effects: boolean;
};

function detect(): Capabilities {
  let webgl = false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    webgl = !!gl;
    if (gl) {
      // Software rasterisers (SwiftShader, Microsoft Basic Render Driver, llvmpipe) run this scene at a
      // few fps and hog the main thread: treat them as "no WebGL" and keep the still image instead.
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      if (/swiftshader|basic render driver|llvmpipe|software/i.test(renderer)) webgl = false;
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    }
  } catch {
    webgl = false;
  }
  const mq = (q: string) => window.matchMedia?.(q).matches ?? false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowPower =
    mq("(pointer: coarse)") ||
    window.innerWidth < 768 ||
    (navigator.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4;
  const params = new URLSearchParams(window.location.search);
  const staticMode = mq("(prefers-reduced-motion: reduce)") || params.get("static") === "1";
  const tier = lowPower ? "lite" : "high";
  return { webgl, tier, staticMode, effects: tier === "high" && params.get("fx") !== "0" };
}

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function NetworkGlobe({ className, scrollProgress, variant = "hero", fallback = true }: NetworkGlobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Client-only component (dynamic ssr:false); the SSR guard keeps a stray server import harmless.
  const [caps] = useState<Capabilities | null>(() => (typeof window === "undefined" ? null : detect()));
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);

  // Shader precompile gate: the loop stays "never" until the scene (and, on the high tier, the
  // bloom passes) report their programs ready, or 3s pass (safety: never leave the image forever).
  const [compiled, setCompiled] = useState(false);
  const pending = useRef(0);
  const onPartCompiled = useCallback(() => {
    pending.current -= 1;
    if (pending.current <= 0) setCompiled(true);
  }, []);
  useEffect(() => {
    if (!caps?.webgl) return;
    pending.current = caps.effects ? 2 : 1;
    const t = setTimeout(() => setCompiled(true), 3000);
    return () => clearTimeout(t);
  }, [caps]);
  // Portrait: the globe is framed as a band across the top and fades out toward the
  // bottom of the container so the host's copy can sit over plain ink beneath it.
  const [portrait, setPortrait] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-aspect-ratio: 9/10)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 9/10)");
    const onChange = () => setPortrait(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause when scrolled offscreen or the tab is hidden.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const dataset = caps?.tier === "lite" ? DATASETS.lite : DATASETS.full;
  const { data, error } = useLandDots(caps?.webgl && !failed ? dataset.url : null);
  const useWebGL = !!caps?.webgl && !failed && !error;

  const frameloop = useMemo(() => {
    if (!caps || !compiled) return "never";
    // Static: run the loop only until the first frame is presented, then render on demand
    // (R3F still invalidates on resize). Everything in the scene is frozen in static mode.
    if (caps.staticMode) return ready ? "demand" : "always";
    return inView && tabVisible ? "always" : "never";
  }, [caps, compiled, inView, tabVisible, ready]);

  const positioned = /\b(absolute|fixed|sticky)\b/.test(className ?? "");
  /** Exposed for QA/tests: "fallback" (image only), "loading" (WebGL warming up), "webgl" (canvas live). */
  const state = !useWebGL ? "fallback" : ready ? "webgl" : "loading";

  return (
    <div
      ref={rootRef}
      className={className}
      data-globe={state}
      data-globe-tier={caps?.tier}
      data-globe-static={caps?.staticMode ? "1" : undefined}
      style={{
        position: positioned ? undefined : "relative",
        overflow: "hidden",
        isolation: "isolate",
        ...(portrait
          ? {
              WebkitMaskImage: "linear-gradient(to bottom, #000 38%, transparent 72%)",
              maskImage: "linear-gradient(to bottom, #000 38%, transparent 72%)",
            }
          : null),
      }}
      aria-hidden="true"
    >
      {/* Static fallback / LCP image. Stays mounted; fades out once WebGL is live. (Same source as the
          host's eager fallback, so this is a cache hit, never a second request.) */}
      {fallback && (
        <Image
          src={FALLBACK_IMAGE}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1024px) 60vw, 100vw"
          style={{
            objectFit: "cover",
            objectPosition: "70% 40%",
            opacity: ready ? 0 : 1,
            transition: "opacity 1.2s cubic-bezier(.22,1,.36,1)",
          }}
        />
      )}

      {useWebGL && data && caps && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: ready ? 1 : 0,
            transition: "opacity 1.2s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <SceneBoundary onError={() => setFailed(true)}>
            <Canvas
              dpr={caps.tier === "lite" ? [1, 1.25] : [1, 1.75]}
              frameloop={frameloop}
              flat
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                stencil: false,
                preserveDrawingBuffer: false,
              }}
              camera={{ fov: 26, near: 0.5, far: 20, position: [0, 0, 3] }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.domElement.addEventListener(
                  "webglcontextlost",
                  (e) => {
                    e.preventDefault();
                    setFailed(true);
                  },
                  { once: true },
                );
              }}
              style={{ position: "absolute", inset: 0, background: "transparent" }}
            >
              <GlobeScene
                variant={variant}
                tier={caps.tier}
                staticMode={caps.staticMode}
                scrollProgress={scrollProgress}
                data={data}
                stepDeg={dataset.stepDeg}
                showLabels={variant === "network" && caps.tier === "high"}
                onFirstFrame={() => setReady(true)}
              />
              <Precompile onDone={onPartCompiled} />
              {caps.effects && (
                <Suspense fallback={null}>
                  <GlobeEffects onCompiled={onPartCompiled} />
                </Suspense>
              )}
            </Canvas>
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
