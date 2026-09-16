import type { ReactNode } from "react";
import { Verify } from "@/components/ui/Verify";
import { cn } from "@/lib/utils";
import type { SpecRow } from "@/content/solutions";

export type SpecPanelProps = {
  /** Mono title (Mango). */
  title: string;
  /** Mono note at the right of the title (Mist). */
  note?: string;
  noteVerify?: string;
  rows: SpecRow[];
  /** Optional big headline between the title and the rows (aside cards). */
  headline?: ReactNode;
  /** Rendered after the rows (e.g. a CTA button). */
  footer?: ReactNode;
  /** "panel" = self-contained Ink card; "bare" = rows only (inside the PageHero aside card). */
  variant?: "panel" | "bare";
  className?: string;
};

/**
 * Ink key/value panel in the brand's "network voice": mono keys in Mist, mono values in Paper,
 * hairline dividers. Used for spec tables, use-case lists and the hero aside stats cards.
 */
const REVIEW = process.env.NEXT_PUBLIC_SHOW_VERIFY === "1";

export function SpecPanel({ title, note: rawNote, noteVerify, rows, headline, footer, variant = "panel", className }: SpecPanelProps) {
  // A note that only exists to flag unverified values ("VALUES PENDING ENGINEERING") is review-only.
  const note = noteVerify && !REVIEW ? undefined : rawNote;
  return (
    <div
      data-tone="ink"
      className={cn(
        variant === "panel" && "rounded-2xl border border-white/10 bg-ink p-6 text-paper md:p-7",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">{title}</p>
        {note && (
          <p className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-mist/80">
            {noteVerify ? <Verify note={noteVerify}>{note}</Verify> : note}
          </p>
        )}
      </div>
      {headline && <div className="mt-3 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-paper md:text-[1.75rem]">{headline}</div>}
      <dl className={cn("divide-y divide-white/10", headline ? "mt-4" : "mt-4")}>
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline justify-between gap-6 py-3">
            <dt className="text-[13px] text-mist">{r.k}</dt>
            <dd className="text-right font-mono text-[12px] font-medium tracking-[0.02em] text-paper">
              {r.verify ? <Verify note={r.verify}>{r.v}</Verify> : r.v}
            </dd>
          </div>
        ))}
      </dl>
      {footer && <div className="mt-5">{footer}</div>}
    </div>
  );
}
