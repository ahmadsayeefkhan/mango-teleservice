"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, EASE, onceTrigger } from "@/components/motion/gsap";
import { onIntroReady } from "@/components/motion/intro";
import { isStatic, takeOver } from "@/components/motion/mode";

/**
 * Client motion wrapper for the capabilities grid. Cards (`[data-cap]`, server-rendered with
 * `.js-hide`) clip-reveal upward with a stagger as the grid enters; on fine pointers a Mango
 * spotlight follows the cursor across the hovered card (CSS vars --sx/--sy, see .sol-spot in globals.css).
 * Static / reduced motion: cards are simply shown; no spotlight.
 */
export function CapabilitiesMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el) return;
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-cap]"));
      if (!cards.length) return;
      if (isStatic()) {
        cards.forEach(takeOver);
        return;
      }
      gsap.set(cards, { clipPath: "inset(0 0 100% 0)", y: 28, opacity: 1, willChange: "clip-path, transform" });
      cards.forEach(takeOver);

      const play = contextSafe!(() => {
        gsap.to(cards, {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 1.1,
          stagger: { each: 0.08, from: "start" },
          ease: EASE.expo,
          clearProps: "willChange,clipPath",
          scrollTrigger: onceTrigger(el, "top 82%"),
        });
      });
      const cancel = onIntroReady(play);

      const handlers: Array<() => void> = [];
      if (window.matchMedia("(pointer: fine)").matches) {
        cards.forEach((card) => {
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--sx", `${e.clientX - r.left}px`);
            card.style.setProperty("--sy", `${e.clientY - r.top}px`);
          };
          card.addEventListener("pointermove", move);
          handlers.push(() => card.removeEventListener("pointermove", move));
        });
      }
      return () => {
        cancel();
        handlers.forEach((h) => h());
      };
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
