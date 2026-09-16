"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, EASE, onceTrigger, loadSplitText, type SplitText } from "./gsap";
import { isLite, isStatic, takeOver } from "./mode";
import { onIntroReady } from "./intro";
import { liteReveal, onNear } from "./lite";
import { cn } from "@/lib/utils";

export type SplitHeadingProps = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  children: ReactNode;
  className?: string;
  /** Seconds before the first line rises (use to sequence hero elements). */
  delay?: number;
  /** Seconds between lines. */
  stagger?: number;
  id?: string;
  /** First-viewport heading: lite tier plays a CSS entrance from first paint (delay in s). See Reveal. */
  enter?: number;
};

/**
 * Headline reveal: SplitText lines + mask, each line rises from below its clip box.
 * `autoSplit` re-splits on resize and after fonts load. Server HTML is plain text (SEO + LCP safe).
 * Lite tier: a whole-heading fade + rise via CSS (SplitText is never downloaded on phones).
 */
export function SplitHeading({ as = "h2", children, className, delay = 0, stagger = 0.08, id, enter }: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el) return;
      if (isStatic()) {
        takeOver(el);
        return;
      }
      if (isLite()) {
        takeOver(el);
        if (enter !== undefined) return;
        return liteReveal(el, [el], { y: 28, delay, duration: 1 });
      }
      let split: SplitText | null = null;
      let played = false;
      let disposed = false;

      // Hidden inline (not via .js-hide) so the heading stays invisible until its lines are masked,
      // even while the preloader overlay lets `.js-hide` content paint underneath it.
      gsap.set(el, { opacity: 0 });
      takeOver(el);

      const run = contextSafe!((ST: typeof SplitText) => {
        if (disposed) return;
        split = ST.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) => {
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.1,
              delay,
              stagger,
              ease: EASE.expo,
              scrollTrigger: onceTrigger(el, "top 88%"),
              onComplete: () => {
                played = true;
              },
            });
          },
        });
        gsap.set(el, { clearProps: "opacity" });
      });

      // Split lazily: only once the heading is within ~1.5 viewports (it is hidden inline until then),
      // so a page with a dozen headings does not split them all in one task when the intro ends.
      let cancelNear: (() => void) | null = null;
      const cancel = onIntroReady(() => {
        cancelNear = onNear(el, () => {
          loadSplitText().then(run);
        });
      });
      return () => {
        disposed = true;
        cancel();
        cancelNear?.();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [] },
  );

  const Tag = as as "h2";
  const style = enter !== undefined ? ({ "--lt-delay": `${enter}s` } as React.CSSProperties) : undefined;
  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} id={id} className={cn("js-hide", enter !== undefined && "lt-enter", className)} style={style}>
      {children}
    </Tag>
  );
}
