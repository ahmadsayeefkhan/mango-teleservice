import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { industries } from "./home-data";

/** Home §05 — Industries: intro column + 2×3 tile grid with hover states. */
export function IndustriesGrid() {
  return (
    <Section tone="paper" id="industries" ariaLabelledby="industries-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal y={16} className="mb-4">
              <Overline>{industries.overline}</Overline>
            </Reveal>
            <SplitHeading as="h2" id="industries-title" className="text-h2 max-w-[14ch]">
              {industries.title}
            </SplitHeading>
            <Reveal y={24} delay={0.15} className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-slate">
              <p>{industries.body}</p>
            </Reveal>
            <Reveal y={16} delay={0.25} className="mt-8">
              <Button href={industries.cta.href} variant="secondary" icon="none">
                {industries.cta.label}
              </Button>
            </Reveal>
          </div>

          <Reveal stagger={0.07} as="ul" className="grid overflow-hidden rounded-2xl border border-stone bg-white sm:grid-cols-2 lg:col-span-8">
            {industries.tiles.map((t) => (
              <li key={t.href} className="group relative border-stone [&:nth-child(n+2)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l">
                <Link href={t.href} className="flex h-full gap-5 p-6 transition-colors duration-300 hover:bg-paper md:p-7">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-stone bg-paper text-ink transition-colors duration-300 group-hover:border-mango group-hover:bg-mango">
                    <Icon icon={t.icon} size={20} />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold leading-snug">
                      {t.title}
                      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" className="translate-y-0.5 text-mango-deep opacity-0 transition-all duration-300 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100" />
                    </span>
                    <span className="text-[14px] leading-relaxed text-slate">{t.line}</span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
