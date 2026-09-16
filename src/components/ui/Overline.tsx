import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type OverlineProps = {
  children: ReactNode;
  /** Surface: "light" → mango-text (5.9:1 on paper); "dark" → Mango Yellow. */
  tone?: "light" | "dark";
  /** Show the 24px tick line before the label. */
  tick?: boolean;
  className?: string;
  as?: "p" | "span" | "div";
  id?: string;
};

/**
 * Mono UPPERCASE eyebrow with a Mango tick line: `<Overline tone="dark">WHAT WE DO</Overline>`.
 */
export function Overline({ children, tone = "light", tick = true, className, as: Tag = "p", id }: OverlineProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "inline-flex items-center gap-3 font-mono text-overline font-medium uppercase",
        tone === "dark" ? "text-mango" : "text-mango-text",
        className,
      )}
    >
      {tick && <span aria-hidden="true" className={cn("inline-block h-0.5 w-6 shrink-0", tone === "dark" ? "bg-mango" : "bg-mango-deep")} />}
      <span>{children}</span>
    </Tag>
  );
}
