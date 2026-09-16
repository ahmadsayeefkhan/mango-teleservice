import type { Metadata } from "next";
import { HubHero } from "@/components/industries/HubHero";
import { IndustryCards } from "@/components/industries/IndustryCards";
import { Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { industries, industriesHub } from "@/content/industries";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: industriesHub.seo.title,
  description: industriesHub.seo.description,
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Industries served by Mango Teleservices",
          itemListElement: industries.map((i, n) => ({ "@type": "ListItem", position: n + 1, name: i.name, url: absoluteUrl(`/industries/${i.slug}`) })),
        }}
      />
      <HubHero crumb={[{ label: "Industries" }]} overline={industriesHub.overline} title={industriesHub.title} sub={industriesHub.sub} />

      <Section tone="paper" id="sectors" aria-label="Sectors">
        <Container>
          <Reveal y={12} className="mb-6 flex items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">
            <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-mango-deep" />
            {industriesHub.gridLabel}
          </Reveal>
          <IndustryCards items={industries} />
        </Container>
      </Section>

      <CTABand overline="NEXT STEP" title={industriesHub.cta.title} body={industriesHub.cta.body} primary={industriesHub.cta.primary} tone="paper" className="pt-0 md:pt-0" />
    </>
  );
}
