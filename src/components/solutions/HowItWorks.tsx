"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Reveal } from "@/components/motion/Reveal";
import { SignalLine } from "@/components/motion/SignalLine";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { SpecPanel } from "./SpecPanel";
import type { Solution } from "@/content/solutions";

export type HowItWorksProps = {
  steps: Solution["how"]["steps"];
  panel: Solution["how"]["panel"];
};

const START = "top 70%";
const END = "bottom 55%";

/**
 * "How it works": four steps beside a vertical Signal Line whose Mango dot is scrubbed by scroll.
 * As the dot passes each step, its numeral fills Mango and the text lights up (the step list and the
 * SignalLine share the same ScrollTrigger range, so they stay in sync). Right: Ink spec/detail panel.
 * Static / reduced motion: every step is shown lit; the dot is frozen.
 */
export function HowItWorks({ steps, panel }: HowItWorksProps) {
  const railWrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = railWrap.current;
      if (!el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
      if (isStatic()) {
        items.forEach((s) => s.setAttribute("data-lit", "true"));
        return;
      }
      const total = items.length;
      // Unlit steps dim only once the list is about to enter the viewport (not at load), so the page
      // never sits with low-contrast text (WCAG / axe) and the dim reads as the start of the sequence.
      const arm = ScrollTrigger.create({ trigger: el, start: "top 95%", once: true, onEnter: () => el.setAttribute("data-armed", "true") });
      const st = ScrollTrigger.create({
        trigger: el,
        start: START,
        end: END,
        scrub: 0.6,
        onUpdate: (self) => {
          // Step i lights when the dot has travelled past its centre (i + 0.5) / total.
          const p = self.progress;
          items.forEach((s, i) => s.setAttribute("data-lit", String(p >= (i + 0.35) / total)));
        },
      });
      // Numeral "pulse" when a step lights up (cheap, transform only).
      const observer = new MutationObserver((muts) => {
        muts.forEach((m) => {
          const t = m.target as HTMLElement;
          if (t.getAttribute("data-lit") === "true") {
            const n = t.querySelector<HTMLElement>("[data-num]");
            if (n) gsap.fromTo(n, { scale: 0.85 }, { scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
          }
        });
      });
      items.forEach((s) => observer.observe(s, { attributes: true, attributeFilter: ["data-lit"] }));
      return () => {
        st.kill();
        arm.kill();
        observer.disconnect();
      };
    },
    { scope: railWrap, dependencies: [] },
  );

  return (
    <Section tone="paper" id="how-it-works" ariaLabelledby="how-title" className="scroll-mt-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Steps + rail */}
          <div className="lg:col-span-6">
            <Reveal y={16} className="mb-8">
              <Overline id="how-title" as="p">
                HOW IT WORKS
              </Overline>
            </Reveal>
            <div ref={railWrap} className="flex gap-5 md:gap-7">
              <div className="flex w-8 shrink-0 justify-center py-4">
                <SignalLine orientation="vertical" progress="scroll" tone="light" trigger={railWrap} start={START} end={END} className="bg-ink/12" />
              </div>
              <Reveal stagger={0.08} as="ol" className="flex flex-1 flex-col" style={{ marginLeft: "-3.25rem" }}>
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    data-step
                    data-lit="false"
                    className="group/step grid grid-cols-[2rem_1fr] items-start gap-x-5 py-4 md:gap-x-7 md:py-5"
                  >
                    <span
                      data-num
                      aria-hidden="true"
                      className="relative z-10 inline-flex size-8 items-center justify-center rounded-full border-2 border-stone bg-paper font-mono text-[11px] font-medium text-slate transition-[background-color,border-color,color] duration-400 ease-out-expo group-data-[lit=true]/step:border-mango group-data-[lit=true]/step:bg-mango group-data-[lit=true]/step:text-ink"
                    >
                      {i + 1}
                    </span>
                    <div className="pt-0.5 transition-opacity duration-400 [[data-armed]_&]:group-data-[lit=false]/step:opacity-45">
                      <h3 className="font-display text-[1.0625rem] font-semibold leading-snug md:text-[1.125rem]">
                        <span className="sr-only">Step {i + 1}: </span>
                        {s.title}
                      </h3>
                      <p className="mt-1.5 max-w-[46ch] text-[15px] leading-relaxed text-slate">{s.body}</p>
                    </div>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>

          {/* Spec / detail panel */}
          <Reveal y={32} delay={0.1} className="lg:col-span-6 lg:pt-14">
            <SpecPanel title={panel.title} note={panel.note} noteVerify={panel.noteVerify} rows={panel.rows} className="lg:sticky lg:top-32" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
