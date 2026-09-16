import type { Metadata } from "next";
import { InsightsExplorer } from "@/components/resources/InsightsExplorer";
import { CTABand } from "@/components/sections/CTABand";
import { articles, insightsHub } from "@/content/resources";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, SITE_LEGAL_NAME } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: insightsHub.seo.title,
  description: insightsHub.seo.description,
  path: "/resources/insights",
});

export default function InsightsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Resources" }, { label: "Insights", href: "/resources/insights" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${insightsHub.title} — Mango Teleservices Insights`,
          url: absoluteUrl("/resources/insights"),
          publisher: { "@type": "Organization", name: SITE_LEGAL_NAME },
          blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: absoluteUrl(`/resources/insights/${a.slug}`),
            datePublished: a.date,
          })),
        }}
      />
      <InsightsExplorer articles={articles} />
      <CTABand overline="ASK US" title={insightsHub.cta.title} body={insightsHub.cta.body} primary={insightsHub.cta.primary} tone="paper" className="pt-0 md:pt-0" />
    </>
  );
}
