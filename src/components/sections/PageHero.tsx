import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { cn } from "@/lib/utils";

export type PageHeroProps = {
  /** Breadcrumb trail; the last item is the current page (href optional). */
  crumb?: Crumb[];
  overline?: string;
  title: string;
  sub?: ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Right-column panel (e.g. quick quote form). Rendered in a graphite card unless `asideBare`. */
  aside?: ReactNode;
  asideBare?: boolean;
  /** Full-bleed background image (dimmed) behind the hero. */
  image?: { src: string; alt: string };
  /** Surface: inner-page heroes are Ink by design; "paper" for utility pages. */
  tone?: "ink" | "paper";
  /** Title size: "h1" (default) or "hero" for landing pages. */
  size?: "h1" | "hero";
  className?: string;
  children?: ReactNode;
};

/**
 * Inner-page hero (Ink). Crumbs → Overline → H1 (SplitText) → sub → CTAs, optional aside/image.
 * `<PageHero crumb={[{label:"Solutions",href:"/solutions"},{label:"IP Transit"}]} overline="CONNECT" title="…" sub="…" primary={{label,href}} />`
 */
export function PageHero({
  crumb,
  overline,
  title,
  sub,
  primary,
  secondary,
  aside,
  asideBare,
  image,
  tone = "ink",
  size = "h1",
  className,
  children,
}: PageHeroProps) {
  const dark = tone === "ink";
  const hasAside = Boolean(aside);
  return (
    <header
      data-tone={tone}
      className={cn("relative overflow-hidden", dark ? "bg-ink text-paper" : "bg-paper text-ink", "pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16", className)}
    >
      {image && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image src={image.src} alt="" fill sizes="100vw" preload className="object-cover opacity-30" />
          <div className={cn("absolute inset-0", dark ? "bg-gradient-to-r from-ink via-ink/80 to-ink/30" : "bg-gradient-to-r from-paper via-paper/80 to-paper/30")} />
        </div>
      )}
      <Container className="relative">
        {crumb && crumb.length > 0 && (
          <Reveal y={12} className="mb-8" enter={0}>
            <Breadcrumbs items={crumb} tone={dark ? "dark" : "light"} />
          </Reveal>
        )}
        <div className={cn("grid gap-10", hasAside && "lg:grid-cols-12 lg:gap-12")}>
          <div className={cn("min-w-0", hasAside ? "lg:col-span-7" : "max-w-[62rem]")}>
            {overline && (
              <Reveal y={16} className="mb-5" enter={0.03}>
                <Overline tone={dark ? "dark" : "light"}>{overline}</Overline>
              </Reveal>
            )}
            {/* ch-based width lives on the title itself so it scales with the heading size (≈ 920px / 3 lines at 1440, per about-1). */}
            <SplitHeading as="h1" className={cn(size === "hero" ? "text-hero max-w-[16ch]" : "text-h1 max-w-[24ch]", "text-balance")} enter={0.06}>
              {title}
            </SplitHeading>
            {sub && (
              <Reveal y={24} delay={0.2} className={cn("mt-6 max-w-[56ch] text-body-l", dark ? "text-mist" : "text-slate")} enter={0.12}>
                {typeof sub === "string" ? <p>{sub}</p> : sub}
              </Reveal>
            )}
            {(primary || secondary) && (
              <Reveal y={24} delay={0.3} className="mt-8 flex flex-wrap gap-3" enter={0.18}>
                {primary && (
                  <Button href={primary.href} variant="primary" tone={dark ? "dark" : "light"} magnetic>
                    {primary.label}
                  </Button>
                )}
                {secondary && (
                  <Button href={secondary.href} variant="secondary" tone={dark ? "dark" : "light"} icon="none">
                    {secondary.label}
                  </Button>
                )}
              </Reveal>
            )}
            {children}
          </div>
          {hasAside && (
            <Reveal y={32} delay={0.35} className="lg:col-span-5" enter={0.22}>
              {asideBare ? (
                aside
              ) : (
                <div className={cn("rounded-3xl border p-6 md:p-8", dark ? "border-white/10 bg-graphite" : "border-stone bg-white")}>{aside}</div>
              )}
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  );
}
