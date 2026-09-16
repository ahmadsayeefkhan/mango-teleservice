import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { cn } from "@/lib/utils";

export type HubHeroProps = {
  crumb: Crumb[];
  overline: string;
  title: string;
  sub?: string;
  /** Rendered under the intro (filter bars, search). */
  children?: ReactNode;
  className?: string;
};

/**
 * Hub-page hero (Ink) for Industries / Insights / Case studies / FAQ: crumbs, overline, large
 * SplitText title (measure set on the heading itself), sub, optional tool row.
 * `enter` = first-viewport CSS entrance on the lite tier (never gated on hydration).
 */
export function HubHero({ crumb, overline, title, sub, children, className }: HubHeroProps) {
  return (
    <header data-tone="ink" className={cn("bg-ink pb-14 pt-8 text-paper md:pb-20 md:pt-12 lg:pt-16", className)}>
      <Container>
        <Reveal y={12} className="mb-8" enter={0}>
          <Breadcrumbs items={crumb} tone="dark" />
        </Reveal>
        <Reveal y={16} className="mb-5" enter={0.03}>
          <Overline tone="dark">{overline}</Overline>
        </Reveal>
        <SplitHeading as="h1" className="max-w-[18ch] text-hero text-balance" enter={0.06}>
          {title}
        </SplitHeading>
        {sub && (
          <Reveal y={24} delay={0.2} className="mt-6 max-w-[56ch] text-body-l text-mist" enter={0.12}>
            <p>{sub}</p>
          </Reveal>
        )}
        {children}
      </Container>
    </header>
  );
}
