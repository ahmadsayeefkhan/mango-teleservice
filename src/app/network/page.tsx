import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchitectureDiagram } from "@/components/company/ArchitectureDiagram";
import { NetworkHero } from "@/components/company/NetworkHero";
import { NetworkLayers } from "@/components/company/NetworkLayers";
import { NetworkPartners } from "@/components/company/NetworkPartners";
import { OpsCards } from "@/components/company/OpsCards";
import { Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { network } from "@/content/company";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: network.seo.title, description: network.seo.description, path: "/network", absoluteTitle: true });

/* Sections below the hero hydrate in separate tasks (see app/page.tsx for the rationale). */
export default function NetworkPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Network", href: "/network" }])} />
      <NetworkHero />

      {/* Architecture */}
      <Suspense>
        <Section tone="ink" id="architecture" ariaLabelledby="architecture-title" className="overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(254,202,38,0.10),transparent)]" />
          <Container className="relative">
            <SectionHeader overline={network.architecture.overline} title={network.architecture.title} intro={network.architecture.intro} tone="dark" align="split" id="architecture-title" />
            <Reveal y={40}>
              <ArchitectureDiagram />
            </Reveal>
            <Reveal y={12} delay={0.1} className="mt-6">
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">
                <Verify note={network.architecture.footnoteVerify}>{network.architecture.footnote}</Verify>
              </p>
            </Reveal>
          </Container>
        </Section>
      </Suspense>

      <Suspense>
        <NetworkLayers />
      </Suspense>
      <Suspense>
        <NetworkPartners />
      </Suspense>
      <Suspense>
        <OpsCards />
        <CTABand title={network.cta.title} body={network.cta.body} primary={network.cta.primary} secondary={network.cta.secondary} overline="CAPACITY" tone="paper" />
      </Suspense>
    </>
  );
}
