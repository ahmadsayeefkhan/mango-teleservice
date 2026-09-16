import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Wordmark colour: "paper" on dark surfaces, "ink" on light. */
  tone?: "paper" | "ink";
  className?: string;
  /** Render as a plain span instead of a Home link. */
  asLink?: boolean;
  size?: "sm" | "md";
};

/** Horizontal logo lockup: Mango mark (image) + Sora wordmark "MANGO / TELESERVICES". */
export function Logo({ tone = "paper", className, asLink = true, size = "md" }: LogoProps) {
  const inner = (
    <>
      <Image
        src="/brand/mango-mark.png"
        alt=""
        width={152}
        height={114}
        preload
        className={cn("w-auto shrink-0", size === "md" ? "h-8 md:h-9" : "h-7")}
      />
      <span className={cn("flex flex-col justify-center leading-none", tone === "paper" ? "text-paper" : "text-ink")}>
        <span className={cn("font-display font-bold tracking-[0.2em]", size === "md" ? "text-[15px] md:text-base" : "text-[13px]")}>MANGO</span>
        <span className={cn("mt-1 font-mono font-medium tracking-[0.3em]", size === "md" ? "text-[7px] md:text-[7.5px]" : "text-[6.5px]")}>
          TELESERVICES
        </span>
      </span>
    </>
  );
  const cls = cn("inline-flex items-center gap-2.5 select-none", className);
  if (!asLink) return <span className={cls}>{inner}</span>;
  return (
    // Accessible name = visible wordmark + " home" (axe label-content-name-mismatch: an aria-label that
    // does not contain the visible text fails; the wordmark spans read as "MANGOTELESERVICES").
    <Link href="/" className={cls}>
      {inner}
      <span className="sr-only">, home</span>
    </Link>
  );
}
