import { cn } from "@/lib/utils";

export type StatusPillProps = {
  label?: string;
  status?: "operational" | "degraded" | "incident";
  /** Surface the pill sits on. */
  tone?: "light" | "dark";
  /** "bare" = dot + label only (utility bar); "pill" = bordered pill. */
  variant?: "bare" | "pill";
  className?: string;
};

const DOT = {
  operational: "bg-signal-green",
  degraded: "bg-mango",
  incident: "bg-signal-red",
} as const;

/** Green dot + mono label: `<StatusPill label="ALL SYSTEMS OPERATIONAL" />`. */
export function StatusPill({
  label = "ALL SYSTEMS OPERATIONAL",
  status = "operational",
  tone = "dark",
  variant = "pill",
  className,
}: StatusPillProps) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] leading-none",
        variant === "pill" && "rounded-full border px-3 py-2",
        variant === "pill" && (tone === "dark" ? "border-white/15 bg-white/[0.04] text-paper" : "border-stone bg-white text-ink"),
        variant === "bare" && (tone === "dark" ? "text-mist" : "text-slate"),
        className,
      )}
    >
      <span className="relative inline-flex size-2">
        <span className={cn("status-dot absolute inset-0 rounded-full", DOT[status])} />
        <span className={cn("relative inline-flex size-2 rounded-full", DOT[status])} />
      </span>
      <span>{label}</span>
    </span>
  );
}
