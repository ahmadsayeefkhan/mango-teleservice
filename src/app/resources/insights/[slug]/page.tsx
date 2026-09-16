import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ArticleBody } from "@/components/resources/ArticleBody";
import { ArticleCard } from "@/components/resources/ArticleCard";
import { ArticleToc } from "@/components/resources/ArticleToc";
import { CTABand } from "@/components/sections/CTABand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { standardCta } from "@/content/site";
import { articleSlugs, categoryLabel, formatDate, getArticle, getArticleCta, readMinutes, articles } from "@/content/resources";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, SITE_LEGAL_NAME } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.summary, path: `/resources/insights/${a.slug}`, image: a.image.src });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const related = a.relatedSlugs.map((s) => articles.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const cta = getArticleCta(a.category);
  const initials = a.author.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Insights", href: "/resources/insights" },
          { label: a.title, href: `/resources/insights/${a.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.summary,
          image: absoluteUrl(a.image.src),
          datePublished: a.date,
          dateModified: a.date,
          author: { "@type": "Organization", name: SITE_LEGAL_NAME },
          publisher: { "@type": "Organization", name: SITE_LEGAL_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/mango-mark.png") } },
          mainEntityOfPage: absoluteUrl(`/resources/insights/${a.slug}`),
          articleSection: categoryLabel(a.category),
          wordCount: readMinutes(a) * 200,
        }}
      />

      <article>
        {/* Header */}
        <header className="bg-paper pt-8 md:pt-12">
          <Container>
            <div className="mx-auto max-w-[820px]">
              <Reveal y={12} className="mb-8" enter={0}>
                <Breadcrumbs items={[{ label: "Insights", href: "/resources/insights" }, { label: categoryLabel(a.category) }]} tone="light" includeHome={false} />
              </Reveal>
              <SplitHeading as="h1" className="text-h1 text-balance" enter={0.05}>
                {a.title}
              </SplitHeading>
              <Reveal y={16} delay={0.2} className="mt-7 flex items-center gap-4" enter={0.12}>
                <span aria-hidden="true" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-stone bg-white font-display text-[13px] font-semibold text-ink">
                  {initials}
                </span>
                <span className="flex flex-col">
                  <span className="text-[14.5px] font-semibold">
                    {a.author.verify ? <Verify note={a.author.verify}>{a.author.name}</Verify> : a.author.name}
                    <span className="font-normal text-slate">, {a.author.role}</span>
                  </span>
                  <span className="mt-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                    <span className="mx-1.5 text-stone">·</span>
                    {readMinutes(a)} min read
                  </span>
                </span>
              </Reveal>
            </div>
          </Container>
        </header>

        {/* Hero image */}
        <div className="bg-paper pt-10 md:pt-12">
          <Container>
            <ParallaxImage src={a.image.src} alt={a.image.alt} speed={0.14} className="aspect-[16/9] rounded-3xl md:aspect-[21/9]" sizes="(min-width: 1280px) 1200px, 100vw" priority />
          </Container>
        </div>

        {/* Body (own hydration task; see app/page.tsx) */}
        <Suspense>
        <Section tone="paper" padding="none" className="py-12 md:py-16">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
              <aside className="min-w-0 lg:col-span-2">
                <div className="lg:sticky lg:top-28">
                  <ArticleToc items={a.sections.map((s) => ({ id: s.id, label: s.heading }))} />
                </div>
              </aside>

              <div className="min-w-0 lg:col-span-7">
                <Reveal y={20}>
                  <div className="rounded-2xl border border-stone border-l-[3px] border-l-mango bg-white p-6 md:p-7">
                    <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango-text">The short answer</p>
                    <p className="text-[1.0625rem] leading-[1.7] text-ink md:text-[1.125rem]">{a.answer}</p>
                  </div>
                </Reveal>
                <div className="mt-10 md:mt-12">
                  <ArticleBody sections={a.sections} />
                </div>
              </div>

              <aside className="min-w-0 lg:col-span-3">
                <Reveal y={24} delay={0.1} className="lg:sticky lg:top-28">
                  <div data-tone="ink" className="rounded-2xl border border-white/10 bg-ink p-6 text-paper">
                    <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango">{a.related.overline}</p>
                    <p className="mt-3 font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em]">{a.related.title}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-mist">{a.related.body}</p>
                    <div className="mt-6">
                      <Button href={a.related.href} variant="primary" tone="dark" size="sm">
                        {a.related.cta}
                        {/* Descriptive link text for SEO / screen readers without changing the visible label. */}
                        <span className="sr-only"> about {a.related.title}</span>
                      </Button>
                    </div>
                  </div>
                </Reveal>
              </aside>
            </div>
          </Container>
        </Section>
        </Suspense>
      </article>

      {/* Related articles */}
      <Suspense>
      {related.length > 0 && (
        <Section tone="stone" id="related" aria-label="Related articles" padding="tight" className="py-16 md:py-20">
          <Container>
            <Reveal y={12} className="mb-6 flex items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">
              <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-mango-deep" />
              Keep reading
            </Reveal>
            <Reveal stagger={0.07} as="ul" className="grid gap-4 md:grid-cols-3 md:gap-5">
              {related.map((r) => (
                <li key={r.slug} className="flex">
                  <ArticleCard article={r} className="w-full" />
                </li>
              ))}
            </Reveal>
          </Container>
        </Section>
      )}

      <CTABand overline="NEXT STEP" title={cta.title} body={cta.body ?? standardCta.body} primary={cta.primary} secondary={cta.secondary} tone="paper" />
      </Suspense>
    </>
  );
}
