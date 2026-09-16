import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { network } from "@/content/company";

/** Network §03 — carrier & content partner logo cards, name row, upstream partner strip. */
export function NetworkPartners() {
  const p = network.partners;
  return (
    <Section tone="stone" id="partners" ariaLabelledby="network-partners-title">
      <Container>
        <SectionHeader
          overline={p.overline}
          title={p.title}
          id="network-partners-title"
          align="split"
          intro={
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate lg:text-right">
              <Verify note={p.permissionNote}>Logos shown with partner permission</Verify>
            </p>
          }
        />
        <Reveal stagger={0.08} as="ul" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {p.logos.map((l) => (
            <li key={l.name} className="group flex flex-col rounded-2xl border border-stone bg-white p-5">
              <span className="relative block h-16 w-full">
                <Image src={l.src} alt={`${l.name} logo`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain grayscale transition-all duration-300 ease-out-expo group-hover:grayscale-0" />
              </span>
              <span className="mt-5 flex items-center justify-between gap-3 border-t border-stone pt-4">
                <span className="text-[13.5px] font-semibold">{l.name}</span>
                <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate">{l.role}</span>
              </span>
            </li>
          ))}
        </Reveal>
        <Reveal y={16} delay={0.1} as="ul" className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3" aria-label="More carriers and content networks">
          {p.names.map((n) => (
            <li key={n} className="font-display text-[1.0625rem] font-semibold text-ink/70">
              {n}
            </li>
          ))}
        </Reveal>
        <Reveal y={16} delay={0.15} className="mt-10 flex flex-col gap-3 border-t border-ink/10 pt-6 md:flex-row md:items-center md:gap-8">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">{p.upstreamLabel}</span>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-medium text-ink/80">
            {p.upstream.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
