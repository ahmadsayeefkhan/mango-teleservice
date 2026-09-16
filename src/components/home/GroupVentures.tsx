import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { group } from "./home-data";

/** Home §08 — Mango Group ventures: four image cards with clip reveal + parallax, "also" line, CTA. */
export function GroupVentures() {
  return (
    <Section tone="ink" id="group" ariaLabelledby="group-title">
      <Container>
        <SectionHeader overline={group.overline} title={group.title} intro={group.body} tone="dark" align="split" id="group-title" />

        <Reveal stagger={0.08} as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {group.cards.map((c) => (
            <li key={c.title} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-graphite">
              <ParallaxImage src={c.image} alt={c.alt} speed={0.1} className="aspect-[16/10] w-full" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-mango">{c.kicker}</p>
                <h3 className="mt-3 font-display text-[1.0625rem] font-semibold leading-snug text-paper">{c.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{c.verify ? <Verify note={c.verify}>{c.line}</Verify> : c.line}</p>
              </div>
            </li>
          ))}
        </Reveal>

        <Reveal y={16} className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">{group.also}</p>
          <Button href={group.cta.href} variant="ghost" tone="dark" className="text-mango hover:text-mango-deep">
            {group.cta.label}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
