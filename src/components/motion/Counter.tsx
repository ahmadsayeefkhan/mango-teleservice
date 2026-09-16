"use client";

import { useRef } from "react";
import { gsap, useGSAP, onceTrigger } from "./gsap";
import { isLite, isStatic } from "./mode";
import { onEnter } from "./lite";

export type CounterProps = {
  to: number;
  from?: number;
  /** Seconds. */
  duration?: number;
  /** Custom number formatter (default: integer, no grouping — years must not get commas). */
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** ScrollTrigger start. */
  start?: string;
};

const defaultFormat = (n: number) => String(Math.round(n));

/**
 * Proof number that ticks up when scrolled into view. Server HTML already shows the final value.
 * Lite tier: the same tween, started by the shared IntersectionObserver instead of a ScrollTrigger.
 */
export function Counter({
  to,
  from = 0,
  duration = 1.6,
  format = defaultFormat,
  prefix = "",
  suffix = "",
  className,
  start = "top 90%",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || isStatic()) return;
      const state = { v: from };
      const render = () => {
        el.textContent = format(state.v);
      };
      const vars = {
        v: to,
        duration,
        ease: "power2.out",
        onUpdate: render,
        onComplete: () => {
          state.v = to;
          render();
        },
      };
      if (isLite()) {
        // Keep the final value in the DOM until the number is about to tick (no "0" flash on phones).
        return onEnter(
          el,
          contextSafe!(() => {
            render();
            gsap.to(state, vars);
          }),
        );
      }
      render();
      gsap.to(state, { ...vars, scrollTrigger: onceTrigger(el, start) });
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <span className={className}>
      {prefix}
      <span ref={ref} className="tabular-nums">
        {format(to)}
      </span>
      {suffix}
    </span>
  );
}
