"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

/** The live Lenis instance (null on the server, in static mode, or before SmoothScroll mounts). */
export function getLenis() {
  return instance;
}

/** @internal set by SmoothScroll */
export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Stop/resume page scrolling (overlays, mobile nav). Falls back to body overflow when Lenis is off. */
export function lockScroll(locked: boolean) {
  if (typeof document === "undefined") return;
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Smooth-scroll to a target (selector, element or px). Uses Lenis when available, native otherwise. */
export function scrollTo(target: string | HTMLElement | number, offset = -96) {
  if (instance) {
    instance.scrollTo(target, { offset });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
