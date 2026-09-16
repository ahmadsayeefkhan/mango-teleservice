/**
 * Single GSAP registration point. Import gsap and plugins from here, never from "gsap" directly,
 * so plugins are registered exactly once and tree-shaken consistently.
 *
 * Only the core + ScrollTrigger ship in the shared bundle. SplitText (desktop headings) and
 * MotionPath (route diagrams) are loaded on demand via `loadSplitText()` / `loadMotionPath()`,
 * so phones — which use the lite tier — never download or evaluate them.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { SplitText } from "gsap/SplitText";
import type { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (process.env.NODE_ENV !== "production") {
    // Dev-only QA handle: inspect tweens / triggers from the console (window.__mango.ScrollTrigger.getAll()).
    (window as unknown as { __mango?: unknown }).__mango = { gsap, ScrollTrigger };
  }
}

let splitText: Promise<typeof SplitText> | null = null;
/** Lazy SplitText (registered on first load). Resolves with the plugin class. */
export function loadSplitText(): Promise<typeof SplitText> {
  splitText ??= import("gsap/SplitText").then((m) => {
    gsap.registerPlugin(m.SplitText);
    return m.SplitText;
  });
  return splitText;
}

let motionPath: Promise<typeof MotionPathPlugin> | null = null;
/** Lazy MotionPathPlugin (registered on first load). Await it before creating `motionPath` tweens. */
export function loadMotionPath(): Promise<typeof MotionPathPlugin> {
  motionPath ??= import("gsap/MotionPathPlugin").then((m) => {
    gsap.registerPlugin(m.MotionPathPlugin);
    return m.MotionPathPlugin;
  });
  return motionPath;
}

/** Brand easings ("The Backbone": calm, engineered, never bouncy). */
export const EASE = {
  reveal: "power3.out",
  expo: "expo.out",
  scrub: "power2.inOut",
  micro: "power2.out",
} as const;

/** gsap.matchMedia() condition strings used across the site. */
export const MEDIA = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  reduce: "(prefers-reduced-motion: reduce)",
  fine: "(pointer: fine)",
} as const;

/**
 * ScrollTrigger vars for a one-shot reveal. Adds a safety net: if the trigger's start lies beyond
 * the scrollable range (element near the bottom of a short page), the animation plays on refresh
 * so content can never stay hidden. Do NOT use `clamp()` starts for reveals — a start clamped to 0
 * never fires at scrollY 0.
 */
export function onceTrigger(trigger: Element, start = "top 88%"): ScrollTrigger.Vars {
  return {
    trigger,
    start,
    once: true,
    onRefresh: (self) => {
      if (self.animation && self.start >= ScrollTrigger.maxScroll(window) - 1) self.animation.play();
    },
  };
}

export { gsap, ScrollTrigger, useGSAP };
export type { SplitText, MotionPathPlugin };
