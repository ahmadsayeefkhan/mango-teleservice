"use client";

import { useSyncExternalStore } from "react";

export type MotionMode = "full" | "static";

/**
 * Inline boot script (runs before first paint, injected by app/layout.tsx).
 * Stamps <html data-motion="full|static"> and, on the first visit of a session with motion enabled,
 * <html data-preload> so the CSS can show the preloader shell immediately.
 * "static" when ?static=1 is present or the OS asks for reduced motion.
 *
 * It also stamps <html data-lite> on phones/tablets (viewport < 1024px or a coarse primary pointer,
 * or ?lite=1 for QA): the "lite" tier keeps the brand motion but runs it with CSS transitions driven
 * by one IntersectionObserver instead of SplitText / per-element ScrollTriggers, never hides
 * first-viewport content behind JS, and skips the preloader and Lenis. See motion/lite.ts.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,q=location.search,m=function(x){return matchMedia(x).matches},s=/[?&]static=1(&|$)/.test(q)||m('(prefers-reduced-motion: reduce)'),l=/[?&]lite=1(&|$)/.test(q)||m('(max-width: 1023px)')||m('(pointer: coarse)');d.setAttribute('data-motion',s?'static':'full');if(l){d.setAttribute('data-lite','')}if(!s&&!l&&!sessionStorage.getItem('mango:intro')){d.setAttribute('data-preload','')}}catch(e){document.documentElement.setAttribute('data-motion','static')}})();`;

/** True when animations must be skipped and content rendered in its final state. Client only. */
export function isStatic() {
  if (typeof document === "undefined") return true;
  return document.documentElement.getAttribute("data-motion") !== "full";
}

/**
 * True on the lite motion tier (touch / < 1024px). Components branch on it *after* `isStatic()`:
 * static wins. Client only (false during SSR).
 */
export function isLite() {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute("data-lite");
}

/** Current motion mode. Client only; returns "static" during SSR. */
export function getMotionMode(): MotionMode {
  return isStatic() ? "static" : "full";
}

/**
 * React hook: motion mode after hydration. Returns `null` on the server and during the first render
 * so components can render mode-independent markup and avoid hydration mismatches.
 */
export function useMotionMode(): MotionMode | null {
  return useSyncExternalStore(noopSubscribe, getMotionMode, getNullSnapshot);
}

/** React hook: `matchMedia(query).matches`, hydration-safe (false on the server / first render). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};
const getNullSnapshot = () => null;

/** Utility: remove the pre-hydration hidden class once JS owns the element. */
export function takeOver(el: Element | null) {
  el?.classList.remove("js-hide");
}
