import type { Metadata } from "next";
import { Suspense } from "react";
import { GroupVentures } from "@/components/home/GroupVentures";
import { HomeHero } from "@/components/home/HomeHero";
import { IndustriesGrid } from "@/components/home/IndustriesGrid";
import { InsightsSection } from "@/components/home/InsightsSection";
import { Milestones } from "@/components/home/Milestones";
import { NetworkSection } from "@/components/home/NetworkSection";
import { ServicesStory } from "@/components/home/ServicesStory";
import { TrustSection } from "@/components/home/TrustSection";
import { homeCta } from "@/components/home/home-data";
import { CTABand } from "@/components/sections/CTABand";
import { JsonLd } from "@/lib/JsonLd";
import { organizationJsonLd, absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Mango Teleservices | IIG, IP Transit, Cloud & Digital Signature in Bangladesh" },
  description:
    "Bangladesh's first private International Internet Gateway, since 2008. IP transit, international circuits, data centre, Mango Cloud and licensed digital signatures.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mango Teleservices | IIG, IP Transit, Cloud & Digital Signature in Bangladesh",
    description:
      "Bangladesh's first private International Internet Gateway, since 2008. IP transit, international circuits, data centre, Mango Cloud and licensed digital signatures.",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    images: [{ url: absoluteUrl("/images/hero-network-globe.png"), width: 1408, height: 768, alt: "Mango network connecting Bangladesh to the world" }],
  },
};

/*
 * Every below-the-fold section sits in its own <Suspense>. Nothing here suspends, so the HTML is
 * still streamed complete in one go; the boundaries only tell React to hydrate each section in a
 * separate task instead of one long commit (their layout effects — GSAP setup — ran together in a
 * single 800ms+ task on phones, which is what Total Blocking Time measures).
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        }}
      />
      <HomeHero />
      <Suspense>
        <ServicesStory />
      </Suspense>
      <Suspense>
        <NetworkSection />
      </Suspense>
      <Suspense>
        <IndustriesGrid />
      </Suspense>
      <Suspense>
        <Milestones />
      </Suspense>
      <Suspense>
        <TrustSection />
      </Suspense>
      <Suspense>
        <GroupVentures />
      </Suspense>
      <Suspense>
        <InsightsSection />
        <CTABand title={homeCta.title} body={homeCta.body} overline={homeCta.overline} primary={homeCta.primary} secondary={homeCta.secondary} tone="paper" />
      </Suspense>
    </>
  );
}
