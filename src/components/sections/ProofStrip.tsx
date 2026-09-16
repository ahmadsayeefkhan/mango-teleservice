import type { ReactNode } from "react";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { cn, parseFigure } from "@/lib/utils";

export type ProofItem = {
  /** Key figure, e.g. "2008", "7+", "24/7", "SMW-4 · SMW-5". Leading integers count up. */
  k: string;
  /** Label. */
  v: ReactNode;
};

export type ProofStripProps = {
  items: ProofItem[];
  /** "dark" = Ink band with Mango figures; "light" = Paper with Ink figures. */
  tone?: "dark" | "light";
  /** Counters tick up when in view (default true). */
  animate?: boolean;
  /** "lg" = Home style (large Sora numerals); "md" = compact mono figures for inner-page strips (sol-* designs). */
  size?: "lg" | "md";
  /** Render without the Container (when already inside one). */
  bare?: boolean;
  className?: string;
};

/**
 * Proof bar: 2–4 key figures with labels, divided by hairlines.
 * `<ProofStrip tone="dark" items={[{ k: "2008", v: "First private IIG licence" }]} />`
 */
export function ProofStrip({ items, tone = "dark", animate = true, bare = false, size = "lg", className }: ProofStripProps) {
  const dark = tone === "dark";
  const compact = size === "md";
  const grid = (
    <Reveal
      stagger={0.08}
      as="dl"
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4",
        dark ? "divide-white/10" : "divide-stone",
        "gap-y-10 lg:divide-x",
      )}
    >
      {items.map((item, i) => {
        const fig = animate ? parseFigure(item.k) : null;
        const numeric = fig && /^\d/.test(item.k);
        return (
          <div key={i} className={cn("flex flex-col gap-2 pr-6", i > 0 && "lg:pl-8")}>
            <dt className="sr-only">{typeof item.v === "string" ? item.v : `Figure ${i + 1}`}</dt>
            <dd
              className={cn(
                dark ? "text-mango" : "text-ink",
                compact || !numeric
                  ? "font-mono text-[1rem] font-medium uppercase leading-snug tracking-[0.06em] md:text-[1.0625rem]"
                  : "font-display text-[2.25rem] font-semibold leading-none tracking-[-0.02em] md:text-[2.75rem]",
                !compact && !numeric && "pt-2",
              )}
            >
              {numeric ? <Counter to={fig.number} suffix={fig.suffix} duration={1.6} /> : item.k}
            </dd>
            <dd className={cn("text-sm leading-relaxed", dark ? "text-mist" : "text-slate")}>{item.v}</dd>
          </div>
        );
      })}
    </Reveal>
  );

  if (bare) return <div className={className}>{grid}</div>;

  return (
    <div data-tone={dark ? "ink" : "paper"} className={cn(dark ? "bg-ink text-paper" : "bg-paper text-ink", compact ? "py-8 md:py-10" : "py-12 md:py-14", className)}>
      <Container>{grid}</Container>
    </div>
  );
}
