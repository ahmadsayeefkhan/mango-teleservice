import type { Metadata } from "next";
import { LegalNav } from "@/components/conversion/LegalNav";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { Verify } from "@/components/ui/Verify";
import { legalMeta, otherDocs, privacySections, type LegalSection } from "@/content/legal";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Mango Teleservices Limited collects, uses and protects the information you share through mango.com.bd. Draft for legal review.",
  path: "/legal/privacy",
});

function Doc({ s, first }: { s: LegalSection; first?: boolean }) {
  return (
    <Reveal y={20} as="section" id={s.id} className={cn("scroll-mt-28", !first && "mt-10")}>
      <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.015em]">{s.title}</h2>
      {s.paragraphs.map((p, i) => {
        const placeholder = p.startsWith("[");
        return (
          <p key={i} className={cn("mt-3 max-w-[66ch] text-[15.5px] leading-relaxed", placeholder ? "font-mono text-[13px] text-slate" : "text-slate")}>
            {placeholder ? <Verify note="legal draft">{p}</Verify> : p}
          </p>
        );
      })}
    </Reveal>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Legal", href: "/legal/privacy" }, { label: "Privacy Policy", href: "/legal/privacy" }])} />

      <header data-tone="ink" className="bg-ink pb-12 pt-8 text-paper md:pb-16 md:pt-12 lg:pt-16">
        <Container>
          <Reveal y={12} className="mb-8">
            <Breadcrumbs items={[{ label: "Legal" }, { label: "Privacy Policy" }]} tone="dark" />
          </Reveal>
          <SplitHeading as="h1" className="text-h1">
            Privacy Policy
          </SplitHeading>
          <Reveal y={12} delay={0.2} className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango">
            <span>
              Last updated: <Verify note="date">{legalMeta.lastUpdated}</Verify>
            </span>
            <span aria-hidden="true" className="text-mist">
              ·
            </span>
            <Tag variant="warn" tone="dark">
              {legalMeta.status}
            </Tag>
          </Reveal>
        </Container>
      </header>

      <section className="bg-paper py-14 md:py-20" aria-label="Legal documents">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-3">
              <LegalNav className="lg:sticky lg:top-28" />
            </div>
            <div className="lg:col-span-8">
              <div id="privacy" className="scroll-mt-28">
                {privacySections.map((s, i) => (
                  <Doc key={s.id} s={s} first={i === 0} />
                ))}
              </div>

              {otherDocs.map((d) => (
                <div key={d.id} id={d.id} className="mt-16 scroll-mt-28 border-t border-stone pt-12">
                  <Reveal y={16} className="mb-2 flex flex-wrap items-center gap-3">
                    <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango-text">{d.label}</p>
                    <Tag variant="warn">Draft for legal review</Tag>
                  </Reveal>
                  <SplitHeading as="h2" className="text-h2">
                    {d.title}
                  </SplitHeading>
                  {d.sections.map((s) => (
                    <Reveal key={s.id} y={20} as="section" id={s.id} className="mt-6 scroll-mt-28">
                      <h3 className="font-display text-[1.125rem] font-semibold tracking-[-0.01em]">{s.title}</h3>
                      {s.paragraphs.map((p, i) => (
                        <p key={i} className={cn("mt-3 max-w-[66ch] text-[15.5px] leading-relaxed text-slate", p.startsWith("[") && "font-mono text-[13px]")}>
                          <Verify note="legal draft">{p}</Verify>
                        </p>
                      ))}
                    </Reveal>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
