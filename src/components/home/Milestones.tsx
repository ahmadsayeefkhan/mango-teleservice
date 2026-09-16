import { Reveal } from "@/components/motion/Reveal";
import { SignalLine } from "@/components/motion/SignalLine";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { milestones } from "./home-data";

/** Home §06 — Milestones: Signal-line timeline (horizontal, scroll-driven dot) / vertical rail on mobile. */
export function Milestones() {
  return (
    <Section tone="stone" id="milestones" ariaLabelledby="milestones-title">
      <Container>
        <SectionHeader
          overline={milestones.overline}
          title={milestones.title}
          tone="light"
          align="split"
          id="milestones-title"
          intro={
            <Button href={milestones.cta.href} variant="ghost" className="lg:float-right">
              {milestones.cta.label}
            </Button>
          }
        />

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <SignalLine progress="scroll" tone="light" start="top 70%" end="bottom 40%" className="bg-ink/15" />
          <Reveal stagger={0.08} as="ol" className="grid grid-cols-3 gap-x-6 gap-y-10 pt-8 lg:grid-cols-6">
            {milestones.items.map((m) => (
              <li key={m.year} className="relative">
                <span className="font-mono text-[1.0625rem] font-medium tracking-[0.04em] text-mango-text">{m.year}</span>
                <h3 className="mt-3 font-display text-[1.0625rem] font-semibold leading-snug">{m.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate">{m.body}</p>
              </li>
            ))}
          </Reveal>
        </div>

        {/* Mobile: vertical rail */}
        <div className="flex gap-5 md:hidden">
          <SignalLine orientation="vertical" progress="scroll" tone="light" start="top 70%" end="bottom 60%" className="bg-ink/15" />
          <Reveal stagger={0.08} as="ol" className="flex flex-1 flex-col gap-7">
            {milestones.items.map((m) => (
              <li key={m.year} className="relative">
                <span aria-hidden="true" className="absolute -left-[27px] top-1.5 size-2.5 rounded-full border-2 border-mango bg-paper" />
                <span className="font-mono text-[12px] font-medium tracking-[0.08em] text-mango-text">{m.year}</span>
                <h3 className="mt-1 font-display text-[1.0625rem] font-semibold leading-snug">{m.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate">{m.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
