import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { insights } from "./home-data";

/** Home §09 — Insights: three article cards. */
export function InsightsSection() {
  return (
    <Section tone="paper" id="insights" ariaLabelledby="insights-title" className="pb-8 md:pb-12 xl:pb-12">
      <Container>
        <SectionHeader
          overline={insights.overline}
          title={insights.title}
          tone="light"
          align="split"
          id="insights-title"
          intro={
            <Button href={insights.cta.href} variant="secondary" icon="none" size="sm" className="lg:float-right">
              {insights.cta.label}
            </Button>
          }
        />
        <Reveal stagger={0.08} as="ul" className="grid gap-8 md:grid-cols-3">
          {insights.articles.map((a, i) => (
            <li key={a.href} className={cn("border-t pt-6", i === 0 ? "border-ink" : "border-stone")}>
              <Link href={a.href} className="group flex h-full flex-col">
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">
                  {a.category} <span className="mx-1 text-stone">·</span> {a.read}
                </p>
                <h3 className="mt-4 font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-mango-text md:text-[1.1875rem]">{a.title}</h3>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14px] font-semibold">
                  Read article
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
