import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { ClicLetters } from "@/components/company/ClicLetters";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CTABand } from "@/components/sections/CTABand";
import { CompanyHero } from "@/components/company/CompanyHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { about, leadership } from "@/content/company";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: about.seo.title, description: about.seo.description, path: "/company/about", absoluteTitle: true });

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Company", href: "/company/about" }, { label: "About", href: "/company/about" }])} />
      <CompanyHero crumb={about.crumb} overline={about.overline} title={about.title} sub={about.sub} measure="max-w-[24ch]" />

      {/* Story + facts (each section in its own Suspense = separate hydration task; see app/page.tsx) */}
      <Suspense>
      <Section tone="paper" id="story" ariaLabelledby="story-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal y={16} className="mb-4">
                <Overline>{about.story.overline}</Overline>
              </Reveal>
              <SplitHeading as="h2" id="story-title" className="text-h2 max-w-[18ch] text-balance">
                {about.story.title}
              </SplitHeading>
              <Reveal stagger={0.1} delay={0.15} className="mt-7 max-w-[62ch] space-y-5 text-[1.0625rem] leading-relaxed text-slate">
                {about.story.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
            </div>
            <Reveal y={32} delay={0.2} className="lg:col-span-5">
              <div data-tone="ink" className="rounded-3xl border border-white/10 bg-ink p-6 text-paper md:p-8">
                <p className="border-b border-white/10 pb-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango">{about.facts.title}</p>
                <dl className="divide-y divide-white/10">
                  {about.facts.rows.map((r) => (
                    <div key={r.k} className="py-4">
                      <dt className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-mist">{r.k}</dt>
                      <dd className="mt-1.5 text-[14.5px] font-medium text-paper">{r.verify ? <Verify note={r.verify}>{r.v}</Verify> : r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          {/* Mission / vision */}
          <Reveal stagger={0.1} as="ul" className="mt-16 grid gap-4 md:mt-20 md:grid-cols-2" id="mission">
            {[about.mission, about.vision].map((m) => (
              <li key={m.label} className="rounded-3xl border border-stone bg-white p-6 md:p-8">
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango-text">{m.label}</p>
                <p className="mt-4 max-w-[26ch] font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] md:text-[1.5rem]">{m.text}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
      </Suspense>

      {/* CLIC */}
      <Suspense>
      <Section tone="ink" id="philosophy" ariaLabelledby="clic-title" className="overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(254,202,38,0.08),transparent)]" />
        <Container className="relative">
          <SectionHeader overline={about.clic.overline} title={about.clic.title} intro={about.clic.intro} tone="dark" align="split" id="clic-title" />
          <ClicLetters />
        </Container>
      </Section>
      </Suspense>

      {/* Values + leadership teaser */}
      <Suspense>
      <Section tone="paper" id="values" ariaLabelledby="values-title">
        <Container>
          <Reveal y={16} className="mb-6">
            <Overline id="values-title" as="p">
              {about.values.overline}
            </Overline>
          </Reveal>
          <Reveal stagger={0.07} as="ol" className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-stone pt-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-8" aria-label="Values">
            {about.values.items.map((v, i) => (
              <li key={v} className="border-l border-stone pl-4 lg:border-l-0 lg:pl-0">
                <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-mango-text">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.01em]">{v}</p>
              </li>
            ))}
          </Reveal>

          <div className="mt-20 grid gap-8 md:mt-24 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <Reveal y={16} className="mb-4">
                <Overline>{about.leaders.overline}</Overline>
              </Reveal>
              <SplitHeading as="h2" className="text-h2 max-w-[14ch] text-balance">
                {about.leaders.title}
              </SplitHeading>
              <Reveal y={16} delay={0.15} className="mt-6">
                <Button href={about.leaders.cta.href} variant="ghost">
                  {about.leaders.cta.label}
                </Button>
              </Reveal>
            </div>
            <Reveal stagger={0.1} delay={0.1} as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {leadership.board.members.map((m) => (
                <li key={m.id}>
                  <Link href={`/company/leadership#${m.id}`} className="group flex h-full items-center gap-5 rounded-2xl border border-stone bg-white p-4 transition-colors hover:border-ink/30 md:p-5">
                    <span className="relative size-[76px] shrink-0 overflow-hidden rounded-xl bg-stone">
                      <Image src={m.image} alt={m.alt} fill sizes="76px" className="object-cover object-top" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[1.0625rem] font-semibold leading-snug">{m.name}</span>
                      <span className="mt-1 block font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate">{m.role}</span>
                      <span className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                        Read biography
                        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand title={about.cta.title} body={about.cta.body} primary={about.cta.primary} secondary={about.cta.secondary} tone="stone" />
      </Suspense>
    </>
  );
}
