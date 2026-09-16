"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { onIntroReady } from "@/components/motion/intro";
import { cn } from "@/lib/utils";

/**
 * 404 divider: a Signal Line with a break in it. The Mango dot travels along the rail, stops at the
 * break, and pulses there ("the route doesn't lead anywhere"). Static mode: dot parked at the break.
 */
export function BrokenSignal({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      const d = dot.current;
      const l = left.current;
      if (!el || !d || !l || !right.current) return;
      // Travel distance: from the rail start to the end of the left segment (the break).
      const stop = () => l.offsetWidth - d.offsetWidth / 2;
      if (isStatic()) {
        gsap.set(d, { x: stop() });
        return;
      }
      gsap.set([l, right.current], { scaleX: 0 });
      gsap.set(d, { x: 0, opacity: 0 });
      const play = contextSafe!(() => {
        gsap
          .timeline({ defaults: { ease: "power2.inOut" } })
          .to(l, { scaleX: 1, duration: 0.7, ease: "expo.out" })
          .to(right.current, { scaleX: 1, duration: 0.7, ease: "expo.out" }, "<0.1")
          .fromTo(d, { x: 0, opacity: 1 }, { x: stop, duration: 1.4 }, "-=0.3")
          // Arrive at the break: a small overshoot and settle, then keep pulsing (CSS .signal-dot).
          .to(d, { x: () => stop() + 6, duration: 0.14, ease: "power2.out" })
          .to(d, { x: stop, duration: 0.3, ease: "power3.out" });
      });
      const cancel = onIntroReady(play);
      return () => cancel();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div ref={root} aria-hidden="true" className={cn("relative mx-auto h-0.5 w-56 md:w-72", className)}>
      <span ref={left} className="absolute inset-y-0 left-0 w-[46%] origin-left rounded-full bg-mango" />
      <span ref={right} className="absolute inset-y-0 right-0 w-[46%] origin-right rounded-full bg-white/15" />
      <span ref={dot} className="signal-dot absolute left-0 top-1/2 block size-2.5 -translate-y-1/2 rounded-full bg-mango" />
    </div>
  );
}
