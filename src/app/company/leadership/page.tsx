import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { ClipImage } from "@/components/company/ClipImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CTABand } from "@/components/sections/CTABand";
import { CompanyHero } from "@/components/company/CompanyHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { leadership } from "@/content/company";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: leadership.seo.title, description: leadership.seo.description, path: "/company/leadership", absoluteTitle: true });

export default function LeadershipPage() {
  const people = [...leadership.board.members, ...leadership.management.members].map((m) => ({
    "@type": "Person",
    name: m.name,
    jobTitle: m.org ? `${m.role}, ${m.org}` : m.role,
    image: absoluteUrl(m.image),
    worksFor: { "@type": "Organization", name: m.org ?? "Mango Teleservices Limited" },
  }));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Company", href: "/company/about" }, { label: "Leadership", href: "/company/leadership" }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": people }} />
      <CompanyHero crumb={leadership.crumb} overline={leadership.overline} title={leadership.title} sub={leadership.sub} />

      {/* Board */}
      <Section tone="paper" id="board" ariaLabelledby="board-title">
        <Container>
          <Reveal y={16} className="mb-8">
            <Overline id="board-title" as="p">
              {leadership.board.overline}
            </Overline>
          </Reveal>
          <div className="flex flex-col gap-6">
            {leadership.board.members.map((m, i) => (
              <article key={m.id} id={m.id} className="scroll-mt-28 grid overflow-hidden rounded-3xl border border-stone bg-white md:grid-cols-12" aria-labelledby={`${m.id}-name`}>
                <div className="p-4 md:col-span-4 md:p-6 lg:col-span-4">
                  <ClipImage src={m.image} alt={m.alt} from="left" delay={i * 0.05} className="aspect-[4/5] w-full rounded-2xl" imgClassName="object-top" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 100vw" />
                </div>
                <div className="flex flex-col p-6 pt-2 md:col-span-8 md:p-8 md:pl-2 lg:p-10 lg:pl-4">
                  <Reveal y={16}>
                    <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango-text">{m.role}</p>
                  </Reveal>
                  <SplitHeading as="h2" id={`${m.id}-name`} className="mt-3 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] md:text-[2rem]">
                    {m.name}
                  </SplitHeading>
                  <Reveal y={20} delay={0.15} className="mt-5 space-y-4">
                    <p className="text-[1.0625rem] font-medium leading-relaxed text-ink">{m.lead}</p>
                    {m.body && (
                      <p className="max-w-[68ch] text-[15px] leading-relaxed text-slate">{m.verify ? <Verify note={m.verify}>{m.body}</Verify> : m.body}</p>
                    )}
                  </Reveal>
                  {m.tags && (
                    <Reveal y={12} delay={0.25} as="ul" className="mt-auto flex flex-wrap gap-2 pt-7" aria-label="Affiliations">
                      {m.tags.map((t) => (
                        <li key={t} className="rounded-full border border-stone bg-paper px-3 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate">
                          {t}
                        </li>
                      ))}
                    </Reveal>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Management */}
      <Section tone="stone" id="management" ariaLabelledby="management-title">
        <Container>
          <SectionHeader overline={leadership.management.overline} title={leadership.management.title} align="stack" id="management-title" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leadership.management.members.map((m, i) => (
              <article key={m.id} id={m.id} className="scroll-mt-28 flex flex-col overflow-hidden rounded-3xl border border-stone bg-white" aria-labelledby={`${m.id}-name`}>
                <ClipImage src={m.image} alt={m.alt} from="bottom" delay={i * 0.08} className="aspect-[4/3] w-full" imgClassName="object-top" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                <Reveal y={20} delay={0.1 + i * 0.08} className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-mango-text">
                    {m.role} · {m.org}
                  </p>
                  <h3 id={`${m.id}-name`} className="mt-3 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]">
                    {m.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-slate">{m.verify ? <Verify note={m.verify}>{m.lead}</Verify> : m.lead}</p>
                </Reveal>
              </article>
            ))}

            {/* Profiles to add */}
            <Reveal y={24} delay={0.25} className="flex flex-col rounded-3xl border border-dashed border-ink/25 bg-paper/60 p-6">
              <Icon icon={UserPlus} size={22} className="text-slate" />
              <h3 className="mt-4 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]">{leadership.management.toAdd.title}</h3>
              <ul className="mt-4 space-y-2 text-[14px] text-slate">
                {leadership.management.toAdd.roles.map((r) => (
                  <li key={r} className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="h-px w-3 bg-mango-deep" />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate">
                <Verify note="management profiles">{leadership.management.toAdd.note}</Verify>
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand title={leadership.cta.title} body={leadership.cta.body} primary={leadership.cta.primary} secondary={leadership.cta.secondary} tone="paper" />
    </>
  );
}
