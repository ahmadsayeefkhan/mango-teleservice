import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Info, Landmark, School, type LucideIcon } from "lucide-react";
import { SectorTabs } from "@/components/company/SectorTabs";
import { VentureCard } from "@/components/company/VentureCard";
import { Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { CompanyHero } from "@/components/company/CompanyHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { group } from "@/content/company";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: group.seo.title, description: group.seo.description, path: "/group", absoluteTitle: true, image: "/images/venture-ev.png" });

const ICONS: Record<"bank" | "school" | "college", LucideIcon> = { bank: Landmark, school: School, college: GraduationCap };

export default function GroupPage() {
  const [telecom, mobility, finance] = group.sectors;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Mango Group", href: "/group" }])} />
      <CompanyHero crumb={group.crumb} overline={group.overline} title={group.title} sub={group.sub}>
        <SectorTabs />
      </CompanyHero>

      {/* Disclaimer */}
      <div data-tone="stone" className="border-y border-stone bg-stone/60 text-ink">
        <Container className="flex items-start gap-3 py-3.5 text-[13px] leading-relaxed text-slate">
          <Icon icon={Info} size={16} className="mt-0.5 text-slate" />
          <p>
            <Verify note={group.noteVerify}>{group.note}</Verify>
          </p>
        </Container>
      </div>

      {/* Telecom */}
      <Section tone="ink" id={telecom.id} ariaLabelledby={`${telecom.id}-title`} className="scroll-mt-20">
        <Container>
          <SectionHeader overline={telecom.overline} title={telecom.title} tone="dark" align="stack" id={`${telecom.id}-title`} />
          <div className="flex flex-col gap-5">
            {group.telecom.map((v, i) => (
              <Reveal key={v.id} y={32} delay={i * 0.05}>
                <VentureCard v={v} dark />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Mobility & Energy */}
      <Section tone="paper" id={mobility.id} ariaLabelledby={`${mobility.id}-title`} className="scroll-mt-20">
        <Container>
          <SectionHeader overline={mobility.overline} title={mobility.title} align="stack" id={`${mobility.id}-title`} />
          <div className="flex flex-col gap-5">
            {group.mobilityEnergy.map((v, i) => (
              <Reveal key={v.id} y={32} delay={i * 0.05}>
                <VentureCard v={v} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Finance & Education */}
      <Section tone="stone" id={finance.id} ariaLabelledby={`${finance.id}-title`} className="scroll-mt-20">
        <Container>
          <SectionHeader overline={finance.overline} title={finance.title} align="stack" id={`${finance.id}-title`} />
          <Reveal stagger={0.08} as="ul" className="grid gap-4 md:grid-cols-3">
            {group.financeEducation.map((c) => {
              const I = ICONS[c.icon];
              return (
                <li key={c.id} id={c.id} className="flex flex-col rounded-3xl border border-stone bg-white p-6 md:p-7">
                  <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl border border-stone bg-paper">
                    {"logo" in c && c.logo ? <Image src={c.logo} alt={`${c.name} logo`} width={40} height={40} className="size-9 object-contain" /> : <Icon icon={I} size={22} className="text-ink" />}
                  </span>
                  <p className="mt-5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-mango-text">{c.kicker}</p>
                  <h3 className="mt-2 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]">{c.name}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-slate">{c.body}</p>
                  <dl className="mt-auto border-t border-stone pt-4">
                    <div className="mt-2">
                      <dt className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate">{c.fact.k}</dt>
                      <dd className="mt-1 font-display text-[1.125rem] font-semibold">{c.fact.v}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </Reveal>
        </Container>
      </Section>

      <CTABand title={group.cta.title} body={group.cta.body} primary={group.cta.primary} secondary={group.cta.secondary} tone="paper" overline="MANGO TELESERVICES" />
    </>
  );
}
