import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { pad } from "@/lib/utils";

export function Challenges({ items, id = "challenges" }: { items: { title: string; body: string }[]; id?: string }) {
  return (
    <Section tone="paper" id={id} ariaLabelledby={`${id}-title`}>
      <Container>
        <SectionHeader overline="SECTOR CHALLENGES" title="What keeps technology leaders up at night." align="stack" id={`${id}-title`} className="mb-10 md:mb-12" />
        <Reveal stagger={0.08} as="ul" className="grid gap-4 md:grid-cols-3 md:gap-5">
          {items.map((c, i) => (
            <li key={c.title} className="group rounded-2xl border border-stone bg-white p-6 transition-colors duration-300 hover:border-ink/40 md:p-7">
              <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-mango-text">{pad(i + 1)}</span>
              <h3 className="mt-4 font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] md:text-[1.1875rem]">{c.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-slate">{c.body}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
