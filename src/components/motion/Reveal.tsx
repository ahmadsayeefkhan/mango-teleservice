"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, EASE, onceTrigger } from "./gsap";
import { isLite, isStatic, takeOver } from "./mode";
import { onIntroReady } from "./intro";
import { liteReveal, onNear } from "./lite";
import { cn } from "@/lib/utils";

export type RevealProps = {
  children: ReactNode;
  /** Rise distance in px. */
  y?: number;
  /** Seconds. */
  delay?: number;
  /** Seconds between direct children. When > 0 the children animate individually, not the wrapper. */
  stagger?: number;
  as?: ElementType;
  className?: string;
  id?: string;
  /** ScrollTrigger start (default "top 88%"; a safety net plays it anyway if unreachable on short pages). */
  start?: string;
  duration?: number;
  style?: React.CSSProperties;
  /**
   * First-viewport (hero) element: on the lite tier it plays a CSS keyframe entrance from first
   * paint (delay in seconds) instead of waiting for hydration, so LCP content never waits for JS.
   * Desktop behaviour is unchanged.
   */
  enter?: number;
};

/**
 * Fade + rise on enter (ScrollTrigger, once). SSR renders the content visible; the element is
 * hidden only after hydration in full-motion mode and a CSS fallback reveals it if JS fails.
 * Lite tier (touch / < lg): IntersectionObserver + CSS transition, no GSAP work at hydration.
 */
export function Reveal({
  children,
  y = 32,
  delay = 0,
  stagger = 0,
  as = "div",
  className,
  id,
  start = "top 88%",
  duration = 1,
  style,
  enter,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el) return;
      if (isStatic()) {
        takeOver(el);
        return;
      }
      const targets: Element[] = stagger > 0 && el.children.length ? Array.from(el.children) : [el];
      if (isLite()) {
        takeOver(el);
        if (enter !== undefined) return;
        return liteReveal(el, targets, { y: Math.min(y, 28), delay, stagger, duration });
      }
      gsap.set(targets, { opacity: 0, y, willChange: "transform, opacity" });
      takeOver(el);

      const play = contextSafe!(() => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: EASE.reveal,
          clearProps: "willChange",
          scrollTrigger: onceTrigger(el, start),
        });
      });
      // After the intro, the ScrollTrigger is created only once the element is within ~1.5 viewports
      // (it is already hidden inline, so this is invisible) — spreads setup across the scroll.
      let cancelNear: (() => void) | null = null;
      const cancel = onIntroReady(() => {
        cancelNear = onNear(el, play);
      });
      return () => {
        cancel();
        cancelNear?.();
      };
    },
    { scope: ref, dependencies: [] },
  );

  const Tag = as as "div";
  const enterStyle = enter !== undefined ? ({ ...style, "--lt-delay": `${enter}s` } as React.CSSProperties) : style;
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} id={id} className={cn("js-hide", enter !== undefined && "lt-enter", className)} style={enterStyle}>
      {children}
    </Tag>
  );
}
