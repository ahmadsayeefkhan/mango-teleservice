import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { parseFigure } from "@/lib/utils";
import type { WhyCard } from "@/content/solutions";

/** "Why Mango": three white proof cards with a large figure (numeric figures count up). */
export function WhyMango({ items }: { items: WhyCard[] }) {
  return (
    <Section tone="paper" id="why-mango" padding="tight" ariaLabelledby="why-title" className="pt-4 md:pt-6 xl:pt-8">
      <Container>
        <Reveal y={16} className="mb-8">
          <Overline id="why-title" as="p">
            WHY MANGO
          </Overline>
        </Reveal>
        <Reveal stagger={0.08} as="ul" className="grid gap-4 md:grid-cols-3">
          {items.map((w) => {
            const fig = parseFigure(w.figure);
            const numeric = fig && /^\d+$/.test(w.figure.trim());
            return (
              <li key={w.title} className="flex flex-col rounded-2xl border border-stone bg-white p-6 md:p-7">
                <p className="font-display text-[2rem] font-semibold leading-none tracking-[-0.025em] text-ink md:text-[2.25rem]">
                  {numeric ? <Counter to={fig.number} duration={1.4} /> : w.figure}
                </p>
                <h3 className="mt-5 font-display text-[1.0625rem] font-semibold leading-snug">{w.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate">{w.verify ? <Verify note={w.verify}>{w.body}</Verify> : w.body}</p>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
