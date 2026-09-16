import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconProps = {
  icon: LucideIcon;
  /** px (default 24). */
  size?: number;
  className?: string;
  /** Decorative by default; pass a label to expose it to assistive tech. */
  label?: string;
} & Pick<LucideProps, "strokeWidth">;

/**
 * Lucide icon with brand defaults (1.5px stroke, rounded caps, currentColor).
 * `<Icon icon={Globe} className="text-mango" />`
 */
export function Icon({ icon: Lucide, size = 24, className, label, strokeWidth = 1.5 }: IconProps) {
  return (
    <Lucide
      size={size}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      className={cn("shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
