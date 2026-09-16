import type { Metadata } from "next";
import { NewsFeed } from "@/components/company/NewsFeed";
import { NewsFilters } from "@/components/company/NewsFilters";
import { CTABand } from "@/components/sections/CTABand";
import { CompanyHero } from "@/components/company/CompanyHero";
import { newsroom } from "@/content/company";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: newsroom.seo.title, description: newsroom.seo.description, path: "/company/newsroom", image: "/images/nbr_training.jpg" });

export default function NewsroomPage() {
  const articles = newsroom.posts
    .filter((p) => p.iso)
    .map((p) => ({
      "@type": "NewsArticle",
      headline: p.title,
      datePublished: p.iso,
      image: absoluteUrl(p.image),
      description: p.excerpt,
      ...(p.href ? { url: absoluteUrl(p.href) } : {}),
      publisher: { "@type": "Organization", name: "Mango Teleservices Limited" },
    }));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Company", href: "/company/about" }, { label: "Newsroom", href: "/company/newsroom" }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@graph": articles }} />
      <CompanyHero crumb={newsroom.crumb} overline={newsroom.overline} title={newsroom.title} sub={newsroom.sub}>
        <NewsFilters />
      </CompanyHero>
      <NewsFeed />
      <CTABand title={newsroom.cta.title} body={newsroom.cta.body} primary={newsroom.cta.primary} secondary={newsroom.cta.secondary} tone="stone" overline="COMPANY PROFILE" />
    </>
  );
}
