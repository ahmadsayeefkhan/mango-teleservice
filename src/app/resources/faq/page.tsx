import type { Metadata } from "next";
import { FaqExplorer } from "@/components/resources/FaqExplorer";
import { CTABand } from "@/components/sections/CTABand";
import { faqGroups, faqHub } from "@/content/resources";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: faqHub.seo.title,
  description: faqHub.seo.description,
  path: "/resources/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Resources" }, { label: "FAQ", href: "/resources/faq" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqGroups.flatMap((g) =>
            g.items.map((it) => ({
              "@type": "Question",
              name: it.q,
              acceptedAnswer: { "@type": "Answer", text: it.a },
            })),
          ),
        }}
      />
      <FaqExplorer groups={faqGroups} />
      <CTABand overline="STILL STUCK?" title={faqHub.cta.title} body={faqHub.cta.body} primary={faqHub.cta.primary} secondary={faqHub.cta.secondary} tone="paper" className="pt-0 md:pt-0" />
    </>
  );
}
