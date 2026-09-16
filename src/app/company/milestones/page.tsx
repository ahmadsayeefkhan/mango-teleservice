import type { Metadata } from "next";
import { Suspense } from "react";
import { MilestoneTimeline } from "@/components/company/MilestoneTimeline";
import { CTABand } from "@/components/sections/CTABand";
import { CompanyHero } from "@/components/company/CompanyHero";
import { milestones } from "@/content/company";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: milestones.seo.title, description: milestones.seo.description, path: "/company/milestones" });

export default function MilestonesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Company", href: "/company/about" }, { label: "Milestones", href: "/company/milestones" }])} />
      <CompanyHero crumb={milestones.crumb} overline={milestones.overline} title={milestones.title} sub={milestones.sub} />
      {/* Own hydration tasks (see app/page.tsx). */}
      <Suspense>
        <MilestoneTimeline />
      </Suspense>
      <Suspense>
        <CTABand title={milestones.cta.title} body={milestones.cta.body} primary={milestones.cta.primary} secondary={milestones.cta.secondary} tone="stone" overline="THE NEXT CHAPTER" />
      </Suspense>
    </>
  );
}
