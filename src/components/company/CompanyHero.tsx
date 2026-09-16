import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { cn } from "@/lib/utils";

export type CompanyHeroProps = {
  crumb: Crumb[];
  overline: string;
  title: string;
  sub?: string;
  /** Extra hero content below the sub (filters, tabs). */
  children?: ReactNode;
  /** H1 measure in `ch` of the H1 itself (default 20). */
  measure?: string;
  id?: string;
};

/**
 * Company-area inner hero (Ink): crumbs → overline → SplitText H1 → sub → optional children.
 * Page-local composition of the foundation primitives (the shared PageHero constrains its title
 * column in body-font `ch`, which wraps the H1 at ~200px; the measure here lives on the H1).
 * `enter` = first-viewport CSS entrance on the lite tier (never gated on hydration).
 */
export function CompanyHero({ crumb, overline, title, sub, children, measure = "max-w-[20ch]", id = "page-title" }: CompanyHeroProps) {
  return (
    <header data-tone="ink" className="relative overflow-hidden bg-ink pb-16 pt-6 text-paper md:pb-24 md:pt-8 lg:pt-10" aria-labelledby={id}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(254,202,38,0.07),transparent)]" />
      <Container className="relative">
        <Reveal y={12} className="mb-8" enter={0}>
          <Breadcrumbs items={crumb} tone="dark" />
        </Reveal>
        <Reveal y={16} className="mb-5" enter={0.03}>
          <Overline tone="dark">{overline}</Overline>
        </Reveal>
        <SplitHeading as="h1" id={id} className={cn("text-h1 text-balance", measure)} enter={0.06}>
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
