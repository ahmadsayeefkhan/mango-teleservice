"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn, isExternalHref } from "@/lib/utils";

export type ButtonProps = {
  children: ReactNode;
  /** When set, renders a link (next/link for internal routes, <a> for external/mailto/tel). */
  href?: string;
  /** primary = Mango fill (Ink label); ink = solid Ink fill (Paper label, for yellow surfaces); secondary = 1px outline; ghost = text link with arrow. */
  variant?: "primary" | "ink" | "secondary" | "ghost";
  /** Surface the button sits on: "light" (paper/stone/white) or "dark" (ink/graphite). */
  tone?: "light" | "dark";
  /** Trailing icon. "arrow" animates on hover. */
  icon?: "arrow" | "external" | "phone" | "none";
  /** "sm" = 44px (header, compact rows), "md" = 52px (default), "lg" = 56px. */
  size?: "sm" | "md" | "lg";
  /** Magnetic hover (fine pointers only). */
  magnetic?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: ComponentPropsWithoutRef<"button">["onClick"];
  disabled?: boolean;
  target?: string;
  ariaLabel?: string;
  /** Forces next/link prefetch off for routes other agents haven't built yet (defaults to Next's behaviour). */
  prefetch?: boolean;
  id?: string;
};

const ICONS = { arrow: ArrowRight, external: ArrowUpRight, phone: Phone };

/**
 * Brand button. Primary buttons are Mango Yellow with Ink text (52px tall at size "md"), radius 8px.
 * `<Button href="/contact" variant="primary" icon="arrow" magnetic>Talk to an engineer</Button>`
 */
export function Button({
  children,
  href,
  variant = "primary",
  tone = "light",
  icon = "arrow",
  size = "md",
  magnetic = false,
  className,
  type = "button",
  onClick,
  disabled,
  target,
  ariaLabel,
  prefetch,
  id,
}: ButtonProps) {
  const dark = tone === "dark";
  const Icon = icon !== "none" ? ICONS[icon] : null;

  const base = cn(
    "group/btn inline-flex items-center justify-center gap-2 rounded-lg font-body font-semibold leading-none whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,transform] duration-200 ease-out-expo",
    "disabled:cursor-not-allowed disabled:opacity-50",
    size === "lg" ? "h-14 px-7 text-[1.0625rem]" : size === "sm" ? "h-11 px-5 text-sm" : "h-[52px] px-6 text-[15px]",
    variant === "ghost" && "h-auto px-0 rounded-none",
  );

  const variants = {
    primary: cn("bg-mango text-ink hover:bg-mango-deep active:translate-y-px", dark && "focus-visible:outline-mango"),
    ink: "bg-ink text-paper hover:bg-graphite active:translate-y-px focus-visible:outline-ink",
    secondary: dark
      ? "border border-paper/70 text-paper hover:border-paper hover:bg-paper/10"
      : "border border-ink text-ink hover:bg-ink hover:text-paper",
    ghost: cn("text-[15px]", dark ? "text-paper hover:text-mango" : "text-ink hover:text-mango-text"),
  } as const;

  const iconEl = !Icon ? null : icon === "arrow" ? (
    // Two arrows: the first slides out to the right while the second slides in from the left.
    <span className="relative inline-flex size-4 overflow-hidden" aria-hidden="true">
      <Icon
        strokeWidth={2}
        className="absolute inset-0 size-4 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-[150%] motion-reduce:transition-none"
      />
      <Icon
        strokeWidth={2}
        className="absolute inset-0 size-4 -translate-x-[150%] transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0 motion-reduce:transition-none"
      />
    </span>
  ) : (
    <Icon
      strokeWidth={2}
      aria-hidden="true"
      className={cn(
        "size-4 transition-transform duration-300 ease-out-expo motion-reduce:transition-none",
        icon === "external" && "group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5",
      )}
    />
  );

  const content = (
    <>
      <span>{children}</span>
      {iconEl}
    </>
  );

  const classes = cn(base, variants[variant], className);

  let node: ReactNode;
  if (href) {
    if (isExternalHref(href)) {
      node = (
        <a
          id={id}
          href={href}
          className={classes}
          target={target ?? (/^https?:/.test(href) ? "_blank" : undefined)}
          rel={/^https?:/.test(href) ? "noopener noreferrer" : undefined}
          aria-label={ariaLabel}
          onClick={onClick as ComponentPropsWithoutRef<"a">["onClick"]}
        >
          {content}
        </a>
      );
    } else {
      node = (
        <Link id={id} href={href} className={classes} aria-label={ariaLabel} prefetch={prefetch} onClick={onClick as ComponentPropsWithoutRef<"a">["onClick"]}>
          {content}
        </Link>
      );
    }
  } else {
    node = (
      <button id={id} type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
        {content}
      </button>
    );
  }

  return magnetic ? <Magnetic strength={0.25}>{node}</Magnetic> : node;
}
