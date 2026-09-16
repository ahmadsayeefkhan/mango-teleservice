import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import type { HubLayer } from "@/content/solutions";
import { LayerNumeral } from "./LayerNumeral";

/**
 * One hub layer group: scroll-scrubbed numeral (01–04), sticky intro column, service cards.
 * Tones alternate paper / stone. Server component (icons render here); motion lives in LayerNumeral.
 */
export function LayerGroup({ layer, index }: { layer: HubLayer; index: number }) {
  const tone = index % 2 === 0 ? "paper" : "stone";
  const titleId = `${layer.code}-title`;

  return (
    <Section tone={tone} id={layer.code} ariaLabelledby={titleId} className="scroll-mt-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <LayerNumeral num={layer.num} />
              <Reveal y={12} className="mt-5">
                <Overline tick={false}>{layer.label}</Overline>
              </Reveal>
              <SplitHeading as="h2" id={titleId} className="mt-3 max-w-[16ch] text-[clamp(1.5rem,1.2rem+1vw,1.875rem)] leading-[1.2] tracking-[-0.02em]">
                {layer.title}
              </SplitHeading>
              <Reveal y={20} delay={0.1} className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-slate">
                <p>{layer.body}</p>
              </Reveal>
            </div>
          </div>

          <Reveal stagger={0.08} as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {layer.services.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex h-full min-h-[150px] flex-col rounded-2xl border border-stone bg-white p-6 transition-[border-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/25 md:p-7"
                >
                  <span className="flex items-start justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg border border-stone bg-paper text-ink transition-colors duration-300 group-hover:border-mango group-hover:bg-mango">
                      <Icon icon={s.icon} size={19} />
                    </span>
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" className="text-mango-deep transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-auto pt-6 font-display text-[1.125rem] font-semibold leading-snug">{s.title}</span>
                  <span className="mt-1.5 text-[14px] leading-relaxed text-slate">{s.line}</span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
