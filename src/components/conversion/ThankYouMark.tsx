"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/components/motion/gsap";
import { isStatic, takeOver } from "@/components/motion/mode";
import { onIntroReady } from "@/components/motion/intro";
import { cn } from "@/lib/utils";

/**
 * Thank-you page mark: the Mango disc scales in, the check draws itself, then a short Signal Line
 * runs beneath it (the request "leaving" along the backbone). Static mode renders the final state.
 */
export function ThankYouMark({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLSpanElement>(null);
  const path = useRef<SVGPathElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      const p = path.current;
      if (!el || !p || !disc.current || !rail.current || !dot.current) return;
      if (isStatic()) {
        gsap.set(dot.current, { x: () => ((rail.current?.offsetWidth ?? 0) - (dot.current?.offsetWidth ?? 0)) * 0.6 });
        takeOver(el);
        return;
      }
      const len = p.getTotalLength();
      gsap.set(disc.current, { scale: 0.4, opacity: 0 });
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(rail.current, { scaleX: 0 });
      gsap.set(dot.current, { x: 0, opacity: 0 });
      takeOver(el);

      const play = contextSafe!(() => {
        const travel = () => (rail.current?.offsetWidth ?? 0) - (dot.current?.offsetWidth ?? 0);
        gsap
          .timeline({ defaults: { ease: EASE.expo } })
          .to(disc.current, { scale: 1, opacity: 1, duration: 0.8 })
          .to(p, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.45")
          .to(rail.current, { scaleX: 1, duration: 0.8 }, "-=0.2")
          .fromTo(dot.current, { x: 0, opacity: 1 }, { x: travel, duration: 1.1, ease: "power2.inOut" }, "<0.1")
          .to(dot.current, { opacity: 0, duration: 0.3 }, ">-0.1");
      });
      const cancel = onIntroReady(play);
      return () => cancel();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div ref={root} className={cn("js-hide flex flex-col items-center gap-6", className)} aria-hidden="true">
      <span ref={disc} className="inline-flex size-16 items-center justify-center rounded-full bg-mango text-ink md:size-[72px]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path ref={path} d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <span ref={rail} className="relative block h-0.5 w-40 origin-center bg-stone md:w-56">
        <span ref={dot} className="signal-dot absolute left-0 top-1/2 block size-2.5 -translate-y-1/2 rounded-full bg-mango" />
      </span>
    </div>
  );
}
