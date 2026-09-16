import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import type { Problem } from "@/content/solutions";

export type WhatItIsProps = {
  title: string;
  body: string;
  problems: Problem[];
};

/** "What it is" + "Problems it solves": Ink section, explanation left, numbered problem list right. */
export function WhatItIs({ title, body, problems }: WhatItIsProps) {
  return (
    <Section tone="ink" id="what-it-is" ariaLabelledby="what-title" className="border-t border-white/10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal y={16} className="mb-4">
              <Overline tone="dark">WHAT IT IS</Overline>
            </Reveal>
            <SplitHeading as="h2" id="what-title" className="text-h2 max-w-[16ch] text-balance">
              {title}
            </SplitHeading>
            <Reveal y={24} delay={0.15} className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-mist">
              <p>{body}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <Reveal y={16} className="mb-2">
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">Problems it solves</p>
            </Reveal>
            <Reveal stagger={0.1} as="ol" className="divide-y divide-white/10 border-y border-white/10">
              {problems.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[2.5rem_1fr] gap-x-2 py-6 md:py-7">
                  <span className="pt-1 font-mono text-[11px] font-medium tracking-[0.12em] text-mango">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-[1.125rem] font-semibold leading-snug md:text-[1.25rem]">{p.title}</h3>
                    <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-mist">{p.body}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
