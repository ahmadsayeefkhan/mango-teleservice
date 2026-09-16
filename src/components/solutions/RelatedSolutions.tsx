import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { relatedCards, type Solution } from "@/content/solutions";

/** Compact "Related solutions" strip that closes each service page. */
export function RelatedSolutions({ solution }: { solution: Solution }) {
  const cards = relatedCards(solution);
  return (
    <Section tone="paper" padding="tight" ariaLabelledby="related-title" className="border-t border-stone">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <Overline id="related-title" as="p">
            RELATED SOLUTIONS
          </Overline>
          <Link href="/solutions" className="text-[14px] font-semibold text-ink transition-colors hover:text-mango-text">
            All solutions
          </Link>
        </div>
        <Reveal stagger={0.07} as="ul" className="mt-6 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-stone bg-white p-5 transition-[border-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/20 md:p-6"
              >
                <span className="flex items-start justify-between">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-stone bg-paper text-ink transition-colors duration-300 group-hover:border-mango group-hover:bg-mango">
                    <Icon icon={c.icon} size={18} />
                  </span>
                  <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" className="text-mango-deep transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate">{c.layer}</span>
                <span className="mt-1.5 font-display text-[1.0625rem] font-semibold leading-snug">{c.title}</span>
                <span className="mt-1.5 text-[14px] leading-relaxed text-slate">{c.line}</span>
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
