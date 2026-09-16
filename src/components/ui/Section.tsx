import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "paper" | "ink" | "stone" | "white" | "graphite";

export type SectionProps = {
  children: ReactNode;
  /** Surface colour; sets background + text colour + `data-tone` (drives focus-ring colour). */
  tone?: SectionTone;
  id?: string;
  className?: string;
  /** Vertical padding preset. "none" for custom layouts. */
  padding?: "default" | "tight" | "none";
  as?: "section" | "div" | "header" | "footer" | "article";
  ariaLabelledby?: string;
  style?: React.CSSProperties;
  /**
   * On the lite tier (touch / < lg) sections get `content-visibility: auto` so the browser skips
   * their layout and paint until they approach the viewport (see `.cv-auto` in globals.css).
   * Pass `false` for a section whose content deliberately overflows its box (e.g. a card pulled
   * up over the hero with a negative margin), since the paint containment would clip it.
   */
  contentVisibility?: boolean;
};

export const TONE_CLASSES: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  stone: "bg-stone/60 text-ink",
  ink: "bg-ink text-paper",
  graphite: "bg-graphite text-paper",
};

/** True when a tone is a dark surface (use to choose `tone="dark"` on Overline/Button). */
export function isDarkTone(tone: SectionTone) {
  return tone === "ink" || tone === "graphite";
}

/**
 * Page section with brand rhythm: `py-20 md:py-28 xl:py-32`, tone-aware colours.
 * `<Section tone="ink" id="network">…</Section>`
 */
export function Section({
  children,
  tone = "paper",
  id,
  className,
  padding = "default",
  as: Tag = "section",
  ariaLabelledby,
  style,
  contentVisibility = true,
}: SectionProps) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      aria-labelledby={ariaLabelledby}
      style={style}
      className={cn(
        "relative",
        contentVisibility && "cv-auto",
        TONE_CLASSES[tone],
        padding === "default" && "py-20 md:py-28 xl:py-32",
        padding === "tight" && "py-12 md:py-16",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
