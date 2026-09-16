import type { Metadata } from "next";
import { HubHero } from "@/components/industries/HubHero";
import { CaseStudyList } from "@/components/resources/CaseStudyList";
import { Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { caseStudies, caseStudiesHub } from "@/content/resources";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: caseStudiesHub.seo.title,
  description: caseStudiesHub.seo.description,
  path: "/resources/case-studies",
});

export default function CaseStudiesPage() {
  const drafts = caseStudies.filter((c) => c.status === "draft").length;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Resources" }, { label: "Case studies", href: "/resources/case-studies" }])} />
      <HubHero crumb={[{ label: "Resources" }, { label: "Case studies" }]} overline={caseStudiesHub.overline} title={caseStudiesHub.title} sub={caseStudiesHub.sub} />

      <Section tone="paper" id="stories" aria-label="Case studies">
        <Container>
          <CaseStudyList items={caseStudies} />
          {drafts > 0 && (
            <Reveal y={8} className="mt-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">
              {drafts} {drafts === 1 ? "story" : "stories"} in draft · {caseStudiesHub.draftNote}
            </Reveal>
          )}
        </Container>
      </Section>

      <CTABand overline="YOUR STORY" title={caseStudiesHub.cta.title} body={caseStudiesHub.cta.body} primary={caseStudiesHub.cta.primary} tone="paper" className="pt-0 md:pt-0" />
    </>
  );
}
