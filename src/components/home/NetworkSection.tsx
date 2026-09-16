import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { RouteDiagram } from "./RouteDiagram";
import { network } from "./home-data";

/** Home §04 — The Network (Ink): route diagram with travelling signals, stats, upstream partners. */
export function NetworkSection() {
  return (
    <Section tone="ink" id="network" ariaLabelledby="network-title" className="overflow-hidden">
      {/* soft yellow glow behind the diagram (brand rule: ≤ 20% opacity radial glow on Ink) */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(254,202,38,0.10),transparent)]" />
      <Container className="relative">
        <SectionHeader overline={network.overline} title={network.title} intro={network.body} tone="dark" align="split" id="network-title" />

        <Reveal y={40}>
          <RouteDiagram />
        </Reveal>

        <Reveal y={24} delay={0.1} className="mt-8 grid gap-6 border-b border-white/10 pb-8 sm:grid-cols-3">
          {network.stats.map((s) => (
            <div key={s.k} className="flex flex-col gap-1">
              <span className="font-mono text-[1.0625rem] font-medium tracking-[0.04em] text-mango">
                {s.verify ? <Verify note={s.verify}>{s.k}</Verify> : s.k}
              </span>
              <span className="text-[13.5px] text-mist">{s.v}</span>
            </div>
          ))}
        </Reveal>

        <Reveal y={16} delay={0.1} className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">{network.upstreamLabel}</span>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {network.upstream.map((u) => (
                <li key={u} className="font-display text-[1.0625rem] font-semibold text-paper/85">
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <Button href={network.cta.href} variant="ghost" tone="dark" className="text-mango hover:text-mango-deep">
            {network.cta.label}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
