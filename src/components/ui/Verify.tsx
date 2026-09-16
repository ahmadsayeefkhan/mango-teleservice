import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type VerifyProps = {
  children: ReactNode;
  /** What needs confirming, e.g. "SLA %", "licence numbers". */
  note?: string;
  className?: string;
};

const SHOW = process.env.NEXT_PUBLIC_SHOW_VERIFY === "1";

/**
 * Wraps an unverified claim. Renders children plainly in production; when
 * `NEXT_PUBLIC_SHOW_VERIFY=1` it adds a subtle dashed "VERIFY" badge for content review.
 */
export function Verify({ children, note, className }: VerifyProps) {
  if (!SHOW) return <>{children}</>;
  return (
    <span className={cn("relative inline", className)} data-verify={note ?? ""}>
      {children}
      <span
        className="ml-1.5 inline-flex -translate-y-px items-center rounded border border-dashed border-signal-red/70 px-1 py-px align-middle font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-signal-red"
        title={note ? `Verify: ${note}` : "Verify before publishing"}
      >
        verify{note ? `: ${note}` : ""}
      </span>
    </span>
  );
}
