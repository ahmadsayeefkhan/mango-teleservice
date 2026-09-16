import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TagProps = {
  children: ReactNode;
  variant?: "neutral" | "good" | "warn" | "bad";
  /** Surface the tag sits on. */
  tone?: "light" | "dark";
  className?: string;
};

/** Mono pill label: `<Tag variant="good">OPERATIONAL</Tag>`. */
export function Tag({ children, variant = "neutral", tone = "light", className }: TagProps) {
  const dark = tone === "dark";
  const styles = {
    neutral: dark ? "border-white/15 text-mist" : "border-stone text-slate",
    good: "border-signal-green/40 text-signal-green",
    warn: dark ? "border-mango/50 text-mango" : "border-mango-deep/60 text-mango-text",
    bad: "border-signal-red/50 text-signal-red",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] leading-none",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
