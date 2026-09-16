import type { Metadata } from "next";
import { LogoGrid } from "@/components/company/LogoGrid";
import { CTABand } from "@/components/sections/CTABand";
import { CompanyHero } from "@/components/company/CompanyHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { partners } from "@/content/company";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: partners.seo.title, description: partners.seo.description, path: "/company/partners" });

export default function PartnersPage() {
  const [clients, carriers, regulators] = partners.groups;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Company", href: "/company/about" }, { label: "Partners & Clients", href: "/company/partners" }])} />
      <CompanyHero crumb={partners.crumb} overline={partners.overline} title={partners.title} sub={partners.sub} />

      <Section tone="paper" ariaLabelledby={`${clients.id}-title`}>
        <Container>
          <LogoGrid id={clients.id} overline={clients.overline} title={clients.title} logos={clients.logos} verify={clients.verify} />
          <LogoGrid id={carriers.id} overline={carriers.overline} title={carriers.title} logos={carriers.logos} verify={carriers.verify} className="mt-20 md:mt-28" />
        </Container>
      </Section>

      <Section tone="stone" ariaLabelledby={`${regulators.id}-title`}>
        <Container>
          <LogoGrid id={regulators.id} overline={regulators.overline} title={regulators.title} logos={regulators.logos} verify={regulators.verify} />
        </Container>
      </Section>

      <CTABand title={partners.cta.title} body={partners.cta.body} primary={partners.cta.primary} secondary={partners.cta.secondary} tone="paper" />
    </>
  );
}
