"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MarqueeProps = {
  children: ReactNode;
  /** Pixels per second. */
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  /** Gap between items (Tailwind class, default "gap-12 md:gap-16"). */
  gapClassName?: string;
  /** Accessible label for the strip. */
  ariaLabel?: string;
};

/**
 * Infinite horizontal marquee (CSS transform loop; duration derived from content width so speed is
 * constant). Content is duplicated once (aria-hidden). Reduced motion / static: animation off.
 */
export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className,
  gapClassName = "gap-12 md:gap-16",
  ariaLabel,
}: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = track.current;
    const f = first.current;
    if (!t || !f) return;
    // ResizeObserver delivers the initial size after layout (no synchronous getBoundingClientRect
    // during hydration, which forced a reflow of the whole page).
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) t.style.setProperty("--marquee-duration", `${(w / Math.max(1, speed)).toFixed(2)}s`);
    });
    ro.observe(f);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div
      className={cn("marquee relative w-full overflow-hidden", className)}
      data-pause-on-hover={pauseOnHover ? "true" : "false"}
      role={ariaLabel ? "region" : undefined}
      aria-label={ariaLabel}
    >
      <div ref={track} className="marquee-track flex w-max">
        <div ref={first} className={cn("flex shrink-0 items-center pr-12 md:pr-16", gapClassName)}>
          {children}
        </div>
        <div className={cn("flex shrink-0 items-center pr-12 md:pr-16", gapClassName)} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
