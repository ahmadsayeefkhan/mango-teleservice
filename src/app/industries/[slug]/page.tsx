import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseTeaser } from "@/components/industries/CaseTeaser";
import { Challenges } from "@/components/industries/Challenges";
import { ProofCard } from "@/components/industries/ProofCard";
import { StackAssembly } from "@/components/industries/StackAssembly";
import { Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { getIndustry, industrySlugs } from "@/content/industries";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, SITE_LEGAL_NAME } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return buildMetadata({ title: ind.seo.title, description: ind.seo.description, path: `/industries/${ind.slug}` });
}

export default async function IndustryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: ind.longName, href: `/industries/${ind.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${ind.longName} infrastructure services`,
          description: ind.seo.description,
          url: absoluteUrl(`/industries/${ind.slug}`),
          provider: { "@type": "Organization", name: SITE_LEGAL_NAME },
          areaServed: "BD",
          audience: { "@type": "BusinessAudience", name: ind.longName },
        }}
      />

      <PageHero
        crumb={[{ label: "Industries", href: "/industries" }, { label: ind.longName }]}
        overline={ind.longName}
        title={ind.hero.title}
        sub={ind.hero.sub}
        primary={ind.hero.primary}
        secondary={ind.hero.secondary}
        aside={<ProofCard industry={ind} />}
      />

      <Challenges items={ind.challenges} />

      <Section tone="stone" id="stack" ariaLabelledby="stack-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionHeader
                  overline="RECOMMENDED STACK"
                  title="The Mango solutions this sector uses most."
                  intro="Combine layers under one contract and one support line."
                  align="stack"
                  id="stack-title"
                  className="mb-0"
                />
                {ind.compliance && (
                  <Reveal y={12} delay={0.2} className="mt-8 hidden border-t border-ink/10 pt-5 lg:block">
                    <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">Note</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-slate">
                      <Verify note={ind.compliance.verify}>{ind.compliance.text}</Verify>
                    </p>
                  </Reveal>
                )}
              </div>
            </div>
            <div className="lg:col-span-8">
              <StackAssembly rows={ind.stack} />
              {ind.compliance && (
                <p className="mt-6 text-[13.5px] leading-relaxed text-slate lg:hidden">
                  <Verify note={ind.compliance.verify}>{ind.compliance.text}</Verify>
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <CaseTeaser story={ind.caseStudy} />

      <CTABand overline="NEXT STEP" title={ind.cta.title} body={ind.cta.body} primary={ind.cta.primary} secondary={ind.cta.secondary} tone="paper" />
    </>
  );
}
