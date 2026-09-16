import type { ReactNode } from "react";
import { Overline } from "@/components/ui/Overline";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/utils";

export type SectionHeaderProps = {
  overline?: string;
  title: string;
  intro?: ReactNode;
  /** Surface: "light" (paper/stone/white) or "dark" (ink/graphite). */
  tone?: "light" | "dark";
  /** "split" = title left, intro right (desktop); "stack" = title then intro. */
  align?: "split" | "stack";
  as?: "h1" | "h2" | "h3";
  /** Optional element rendered at the end of the intro column (e.g. a ghost Button). */
  action?: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Standard section opener: Overline + SplitHeading + intro.
 * `<SectionHeader overline="WHAT WE DO" title="One partner…" intro="…" align="split" />`
 */
export function SectionHeader({
  overline,
  title,
  intro,
  tone = "light",
  align = "split",
  as = "h2",
  action,
  className,
  id,
}: SectionHeaderProps) {
  const dark = tone === "dark";
  const split = align === "split";
  return (
    <div className={cn("mb-12 md:mb-16", split && "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10", className)}>
      <div className={cn(split && "lg:col-span-7")}>
        {overline && (
          <Reveal y={16} className="mb-4">
            <Overline tone={dark ? "dark" : "light"}>{overline}</Overline>
          </Reveal>
        )}
        <SplitHeading as={as} id={id} className={cn("text-balance", as === "h1" ? "text-h1" : "text-h2", split && "max-w-[18ch]")}>
          {title}
        </SplitHeading>
      </div>
      {(intro || action) && (
        <Reveal
          y={24}
          delay={0.15}
          className={cn(
            "text-body-l",
            dark ? "text-mist" : "text-slate",
            split ? "lg:col-span-5 lg:pb-1.5" : "mt-5 max-w-[62ch]",
          )}
        >
          {typeof intro === "string" ? <p>{intro}</p> : intro}
          {action && <div className="mt-6">{action}</div>}
        </Reveal>
      )}
    </div>
  );
}
