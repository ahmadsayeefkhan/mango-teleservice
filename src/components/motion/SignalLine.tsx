"use client";

import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "./gsap";
import { isLite, isStatic } from "./mode";
import { onVisible } from "./lite";
import { cn } from "@/lib/utils";

export type SignalLineProps = {
  /** "scroll" = dot position is scrubbed by scroll through the trigger; "auto" = loops; number = fixed 0–1. */
  progress?: "scroll" | "auto" | number;
  /** Surface the line sits on. */
  tone?: "light" | "dark";
  orientation?: "horizontal" | "vertical";
  /** Element whose scroll progress drives the dot (defaults to the nearest <section>, else the line). */
  trigger?: RefObject<HTMLElement | null>;
  /** ScrollTrigger start/end when progress="scroll". */
  start?: string;
  end?: string;
  className?: string;
  /** Seconds per loop when progress="auto". */
  loopDuration?: number;
};

/**
 * Signature element: a 2px rail with a travelling Mango dot ("data moving along the backbone").
 * Use as a section divider, timeline or progress rail. Static mode freezes the dot at 60%.
 * Looping ("auto") dots pause while off-screen; the lite tier scrubs without smoothing.
 */
export function SignalLine({
  progress = "scroll",
  tone = "light",
  orientation = "horizontal",
  trigger,
  start = "top 80%",
  end = "bottom 30%",
  className,
  loopDuration = 3.2,
}: SignalLineProps) {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const horizontal = orientation === "horizontal";

  useGSAP(
    () => {
      const el = root.current;
      const d = dot.current;
      if (!el || !d) return;
      const axis = horizontal ? "x" : "y";
      const travel = () => (horizontal ? el.offsetWidth : el.offsetHeight) - d.offsetWidth;

      if (typeof progress === "number" || isStatic()) {
        const p = typeof progress === "number" ? progress : 0.6;
        gsap.set(d, { [axis]: () => travel() * p });
        return;
      }
      if (progress === "auto") {
        const loop = gsap.fromTo(
          d,
          { [axis]: 0, opacity: 0 },
          {
            [axis]: travel,
            opacity: 1,
            duration: loopDuration,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 0.6,
            paused: true,
          },
        );
        return onVisible(el, (v) => loop.paused(!v));
      }
      const triggerEl = trigger?.current ?? el.closest("section") ?? el;
      gsap.fromTo(
        d,
        { [axis]: 0 },
        {
          [axis]: travel,
          ease: "none",
          scrollTrigger: { trigger: triggerEl, start, end, scrub: isLite() ? true : 0.6, invalidateOnRefresh: true },
        },
      );
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={cn(
        "relative shrink-0",
        horizontal ? "h-0.5 w-full" : "w-0.5 self-stretch",
        tone === "dark" ? "bg-white/10" : "bg-stone",
        className,
      )}
    >
      <span
        ref={dot}
        className={cn(
          "signal-dot absolute block size-2.5 rounded-full bg-mango",
          horizontal ? "top-1/2 left-0 -translate-y-1/2" : "left-1/2 top-0 -translate-x-1/2",
        )}
      />
    </div>
  );
}
