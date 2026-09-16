"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { isLite, isStatic, takeOver } from "@/components/motion/mode";
import { onIntroReady } from "@/components/motion/intro";

/**
 * Page-enter transition (≤ 0.6s): the page fades in while its own Reveal/SplitHeading elements rise.
 * Opacity only (no transforms) so pinned/sticky children are never affected.
 * Lite tier: no page fade — first-viewport content paints as the server rendered it (LCP).
 */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el) return;
      if (isStatic() || isLite()) {
        takeOver(el);
        return;
      }
      gsap.set(el, { opacity: 0 });
      takeOver(el);
      const cancel = onIntroReady(
        contextSafe!(() => {
          gsap.to(el, { opacity: 1, duration: 0.55, ease: "power2.out", clearProps: "opacity" });
        }),
      );
      return () => cancel();
    },
    { scope: ref, dependencies: [] },
  );

  // New page content mounted: recompute ScrollTrigger positions once layout has settled.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className="js-hide">
      {children}
    </div>
  );
}
