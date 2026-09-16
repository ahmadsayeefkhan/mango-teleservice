import type { Metadata } from "next";
import { Check, Mail } from "lucide-react";
import { CareersHero } from "@/components/conversion/CareersHero";
import { RolesList } from "@/components/conversion/RolesList";
import { TeamsList } from "@/components/conversion/TeamsList";
import { Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { careersMisc as m, whyMango } from "@/content/careers";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers at Mango | Telecom & Cloud Jobs in Dhaka",
  absoluteTitle: true,
  description:
    "Join the engineers, security specialists, developers and sales professionals who keep Bangladesh connected. Open roles across network operations, cloud, Mango CA, software and sales.",
  path: "/careers",
  image: "/images/careers-noc-team.png",
});

export default function CareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }])} />
      <CareersHero />

      {/* Why work here */}
      <Section tone="paper" id="why-mango" ariaLabelledby="why-title">
        <Container>
          <SectionHeader overline={whyMango.overline} title={whyMango.title} align="stack" id="why-title" className="mb-10 md:mb-12" />
          <Reveal stagger={0.07} as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyMango.cards.map((c) => (
              <li key={c.title} className="group flex flex-col gap-4 rounded-2xl border border-stone bg-white p-6 transition-colors duration-300 hover:border-ink/30">
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-stone bg-paper text-ink transition-colors duration-300 group-hover:border-mango group-hover:bg-mango">
                  <Icon icon={c.icon} size={20} />
                </span>
                <h3 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">{c.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate">{c.body}</p>
              </li>
            ))}
          </Reveal>
          <Reveal y={16} delay={0.1} className="mt-8">
            <ul className="flex flex-wrap gap-2" aria-label="Benefits">
              {whyMango.benefits.map((b) => (
                <li key={b} className="inline-flex h-9 items-center gap-2 rounded-full border border-stone bg-white px-4 text-[13px] font-medium text-ink">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" className="text-mango-deep" />
                  <Verify note={whyMango.benefitsVerify}>{b}</Verify>
                </li>
              ))}
              <li className="inline-flex h-9 items-center rounded-full border border-dashed border-stone px-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">
                [VERIFY benefits]
              </li>
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* Teams */}
      <Section tone="ink" id="teams" ariaLabelledby="teams-title">
        <Container>
          <SectionHeader overline="TEAMS" title="Find where you fit." tone="dark" align="stack" id="teams-title" className="mb-8 md:mb-10" />
          <TeamsList />
        </Container>
      </Section>

      {/* Open roles */}
      <Section tone="paper" id="open-roles" ariaLabelledby="roles-title" className="scroll-mt-24">
        <Container>
          <SectionHeader
            overline={m.rolesOverline}
            title={m.rolesTitle}
            id="roles-title"
            align="split"
            className="mb-8 md:mb-10"
            intro={
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate lg:text-right">
                <Verify note="sample listings; real roles are CMS-driven">{m.rolesNote}</Verify>
              </p>
            }
          />
          <RolesList />
          <Reveal y={12} className="mt-6 flex items-center gap-2.5 text-[14px] text-slate">
            <Icon icon={Mail} size={16} className="text-slate" />
            <span>
              {m.cvLine}{" "}
              <a href={`mailto:${m.cvEmail}`} className="font-medium text-ink underline-offset-4 hover:underline">
                <Verify note={m.cvVerify}>{m.cvEmail}</Verify>
              </a>
            </span>
          </Reveal>
        </Container>
      </Section>

      <CTABand
        overline={m.internship.overline}
        title={m.internship.title}
        body={<Verify note={m.internship.verify}>{m.internship.body}</Verify>}
        primary={m.internship.cta}
        tone="paper"
        className="pt-0 md:pt-0"
      />
    </>
  );
}
