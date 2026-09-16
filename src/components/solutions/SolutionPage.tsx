import { Suspense } from "react";
import { CTABand } from "@/components/sections/CTABand";
import { FAQ } from "@/components/sections/FAQ";
import { PageHero } from "@/components/sections/PageHero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Verify } from "@/components/ui/Verify";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, SITE_LEGAL_NAME } from "@/lib/seo";
import { LAYER_LABEL, type Solution } from "@/content/solutions";
import { CapabilitiesGrid } from "./CapabilitiesGrid";
import { HowItWorks } from "./HowItWorks";
import { RelatedSolutions } from "./RelatedSolutions";
import { SolutionAside } from "./SolutionAside";
import { StoryCard } from "./StoryCard";
import { WhatItIs } from "./WhatItIs";
import { WhyMango } from "./WhyMango";

/**
 * Shared, data-driven service page template (Template A):
 * hero + aside → proof strip → what it is + problems → capabilities → how it works + panel →
 * why Mango → optional story → FAQ → CTA band → related solutions.
 * Below-the-fold sections sit in their own <Suspense> so each hydrates in a separate task
 * (see app/page.tsx).
 */
export function SolutionPage({ s }: { s: Solution }) {
  const crumb = [
    { label: "Solutions", href: "/solutions" },
    { label: LAYER_LABEL[s.layer], href: `/solutions#${s.layer}` },
    { label: s.name },
  ];
  const faqItems = s.faq.items.map((f) => ({
    q: f.q,
    a: f.verify ? <Verify note={f.verify}>{f.a}</Verify> : f.a,
  }));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, ...crumb.map((c) => ({ label: c.label, href: c.href }))])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          serviceType: s.seo.title,
          description: s.seo.description,
          url: absoluteUrl(`/solutions/${s.slug}`),
          areaServed: { "@type": "Country", name: "Bangladesh" },
          provider: { "@type": "Organization", name: SITE_LEGAL_NAME, url: absoluteUrl("/") },
        }}
      />

      <PageHero
        crumb={crumb}
        overline={s.hero.overline}
        title={s.hero.title}
        sub={s.hero.sub}
        primary={s.hero.primary}
        secondary={s.hero.secondary}
        aside={<SolutionAside slug={s.slug} aside={s.aside} />}
        className="pb-0 md:pb-0"
      >
        {/* Proof strip sits inside the hero surface, separated by a hairline (sol-* designs). */}
      </PageHero>
      <div data-tone="ink" className="border-t border-white/10 bg-ink text-paper">
        <ProofStrip
          tone="dark"
          size="md"
          className="bg-transparent"
          items={s.proof.map((p) => ({ k: p.k, v: p.verify ? <Verify note={p.verify}>{p.v}</Verify> : p.v }))}
        />
      </div>

      <Suspense>
        <WhatItIs title={s.what.title} body={s.what.body} problems={s.problems} />
      </Suspense>
      <Suspense>
        <CapabilitiesGrid title={s.capabilities.title} items={s.capabilities.items} />
      </Suspense>
      <Suspense>
        <HowItWorks steps={s.how.steps} panel={s.how.panel} />
      </Suspense>
      <Suspense>
        <WhyMango items={s.why} />
        {s.story && <StoryCard story={s.story} />}
      </Suspense>
      <Suspense>
        <FAQ items={faqItems} title={s.faq.title} tone="light" />
      </Suspense>
      <Suspense>
        <CTABand title={s.cta.title} primary={s.cta.primary} secondary={s.cta.secondary} overline="NEXT STEP" tone="paper" className="pt-4 md:pt-6" />
        <RelatedSolutions solution={s} />
      </Suspense>
    </>
  );
}
