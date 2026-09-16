import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Quote } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { CaseStats } from "@/components/resources/CaseStats";
import { CTABand } from "@/components/sections/CTABand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { caseStudySlugs, getCaseStudy } from "@/content/resources";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, SITE_LEGAL_NAME } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs?.detail) return {};
  return buildMetadata({ title: cs.detail.seo.title, description: cs.detail.seo.description, path: `/resources/case-studies/${cs.slug}`, image: cs.image.src });
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs?.detail) notFound();
  const d = cs.detail;

  const narrative = [
    { h: "The challenge", body: d.challenge },
    { h: "What we delivered", body: d.delivered },
    { h: "The outcome", body: d.outcome },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Case studies", href: "/resources/case-studies" },
          { label: cs.client, href: `/resources/case-studies/${cs.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: d.title,
          description: d.seo.description,
          image: absoluteUrl(cs.image.src),
          datePublished: "2023-12-12",
          author: { "@type": "Organization", name: SITE_LEGAL_NAME },
          publisher: { "@type": "Organization", name: SITE_LEGAL_NAME },
          mainEntityOfPage: absoluteUrl(`/resources/case-studies/${cs.slug}`),
        }}
      />

      <PageHero
        crumb={[{ label: "Case studies", href: "/resources/case-studies" }, { label: cs.sector }]}
        overline={d.overline}
        title={d.title}
        aside={<CaseStats stats={cs.stats} labels={["Officials certified", "Advanced courses", "Cohort programme"]} />}
        className="pb-10 md:pb-14"
      />

      <Section tone="paper" padding="none" className="pt-10 md:pt-14">
        <Container>
          <ParallaxImage src={cs.image.src} alt={cs.image.alt} speed={0.14} className="aspect-[16/9] rounded-3xl md:aspect-[21/9]" sizes="(min-width: 1280px) 1200px, 100vw" priority />
        </Container>
      </Section>

      <Section tone="paper" id="story" aria-label="Case study detail" className="pt-14 md:pt-20 xl:pt-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Facts rail */}
            <Reveal y={16} className="lg:col-span-3">
              <dl className="divide-y divide-stone border-y border-stone lg:sticky lg:top-28">
                {d.facts.map((f) => (
                  <div key={f.label} className="py-4">
                    <dt className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">{f.label}</dt>
                    <dd className="mt-1.5 text-[15px] font-semibold">{f.verify ? <Verify note={f.verify}>{f.value}</Verify> : f.value}</dd>
                  </div>
                ))}
                <div className="py-4">
                  <dt className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">Services used</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {d.services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-stone bg-white px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        {s.label}
                        <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" className="text-mango-deep transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mango" />
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>
            </Reveal>

            {/* Narrative */}
            <div className="lg:col-span-8 lg:col-start-5">
              <Reveal stagger={0.1} className="flex flex-col gap-8 md:gap-10">
                {narrative.map((n) => (
                  <section key={n.h}>
                    <h2 className="text-[1.375rem] leading-tight tracking-[-0.02em] md:text-[1.5rem]">{n.h}</h2>
                    <p className="mt-3 max-w-[64ch] text-[1.0625rem] leading-[1.7] text-ink/85">
                      {n.h === "The outcome" ? <Verify note="wording and permission">{n.body}</Verify> : n.body}
                    </p>
                  </section>
                ))}
              </Reveal>

              <Reveal y={32} className="mt-12 md:mt-14">
                <figure data-tone="ink" className="rounded-3xl border border-white/10 bg-ink p-7 text-paper md:p-9">
                  <Quote size={28} strokeWidth={1.5} aria-hidden="true" className="text-mango" />
                  <blockquote className="mt-5 max-w-[40ch] font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.015em] md:text-[1.625rem]">
                    <Verify note={d.quote.verify}>&ldquo;{d.quote.text}&rdquo;</Verify>
                  </blockquote>
                  <figcaption className="mt-5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mist">{d.quote.by}</figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand overline="NEXT STEP" title={d.cta.title} body={d.cta.body} primary={d.cta.primary} secondary={d.cta.secondary} tone="paper" className="pt-0 md:pt-0" />
    </>
  );
}
