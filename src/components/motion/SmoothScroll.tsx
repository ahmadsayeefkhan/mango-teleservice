"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { isLite, isStatic } from "./mode";
import { setLenis } from "./lenis-store";

/**
 * Lenis smooth scroll driven by gsap.ticker and synced with ScrollTrigger.
 * Disabled entirely in static mode (?static=1 / prefers-reduced-motion) and on the lite tier
 * (touch devices scroll natively; Lenis is not even downloaded there). Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (isStatic() || isLite()) return;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let cancelled = false;
    const onScroll = () => ScrollTrigger.update();

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -96 },
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      });
      setLenis(lenis);
      lenis.on("scroll", onScroll);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      if (tick) gsap.ticker.remove(tick);
      if (lenis) {
        lenis.off("scroll", onScroll);
        lenis.destroy();
      }
      setLenis(null);
    };
  }, []);

  return null;
}
