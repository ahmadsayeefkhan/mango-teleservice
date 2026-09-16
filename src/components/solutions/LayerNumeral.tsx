"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { isStatic, takeOver } from "@/components/motion/mode";

/**
 * Hub layer numeral (01–04): scrubs in with scroll as its section enters (clip wipe from the left +
 * a Mango tick that draws underneath). Static / reduced motion: final state.
 */
export function LayerNumeral({ num }: { num: string }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const num = numRef.current;
      const tick = tickRef.current;
      if (!num || !tick) return;
      if (isStatic()) {
        takeOver(num);
        return;
      }
      const section = num.closest("section") ?? num;
      gsap.set(num, { clipPath: "inset(0 100% 0 0)", x: -14, opacity: 1 });
      gsap.set(tick, { scaleX: 0, transformOrigin: "left center" });
      takeOver(num);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 85%", end: "top 40%", scrub: 0.5 },
      });
      tl.to(num, { clipPath: "inset(0 0% 0 0)", x: 0, ease: "none" }, 0).to(tick, { scaleX: 1, ease: "none" }, 0.2);
    },
    { scope: numRef, dependencies: [] },
  );

  return (
    <>
      <span ref={numRef} aria-hidden="true" className="js-hide block font-mono text-[2.75rem] font-medium leading-none tracking-[-0.02em] text-mango-text md:text-[3.25rem]">
        {num}
      </span>
      <span ref={tickRef} aria-hidden="true" className="mt-4 block h-0.5 w-10 bg-mango-deep" />
    </>
  );
}
