"use client";

import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { HubHero } from "@/components/industries/HubHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./ArticleCard";
import { NewsletterCard } from "./NewsletterCard";
import { categories, categoryLabel, insightsHub, readMinutes, type Article, type CategoryId } from "@/content/resources";

type Filter = "all" | CategoryId;

function matches(a: Article, q: string) {
  if (!q) return true;
  const hay = `${a.title} ${a.summary} ${a.answer} ${categoryLabel(a.category)}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

/**
 * Insights hub: hero with category chips + live search, then either the editorial layout
 * (featured + picks + grid) or, when filtering, a flat grid. Result counts are announced via aria-live.
 */
export function InsightsExplorer({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim());
  const inputId = useId();
  const filtering = filter !== "all" || q.length > 0;

  const results = useMemo(() => articles.filter((a) => (filter === "all" || a.category === filter) && matches(a, q)), [articles, filter, q]);

  const featured = articles.find((a) => a.placement === "featured") ?? articles[0];
  const picks = articles.filter((a) => a.placement === "pick").slice(0, 4);
  const rest = articles.filter((a) => a !== featured && !picks.includes(a));

  const announce = filtering
    ? `${results.length} ${results.length === 1 ? "article" : "articles"}${filter !== "all" ? ` in ${categoryLabel(filter)}` : ""}${q ? ` matching “${q}”` : ""}`
    : `Showing all ${articles.length} articles`;

  return (
    <>
      <HubHero crumb={[{ label: "Resources" }, { label: "Insights" }]} overline={insightsHub.overline} title={insightsHub.title} sub={insightsHub.sub}>
        <Reveal y={16} delay={0.3} className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by category" className="-mx-5 min-w-0 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0">
            <div className="flex w-max gap-2">
              {[{ id: "all" as const, label: "All" }, ...categories].map((c) => {
                const on = filter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(c.id)}
                    className={cn(
                      "inline-flex h-9 items-center whitespace-nowrap rounded-full border px-4 text-[13.5px] font-medium transition-colors duration-200 focus-visible:outline-mango",
                      on ? "border-mango bg-mango text-ink" : "border-white/20 text-paper hover:border-paper/60",
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="relative w-full lg:w-[300px]">
            <label htmlFor={inputId} className="sr-only">
              Search insights
            </label>
            <Search size={16} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={insightsHub.searchPlaceholder}
              autoComplete="off"
              className="h-11 w-full rounded-lg border border-white/15 bg-graphite pl-11 pr-10 text-[15px] text-paper placeholder:text-mist/70 focus-visible:outline-mango [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-mist hover:text-paper">
                <X size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
        </Reveal>
      </HubHero>

      <Section tone="paper" id="articles" aria-label="Articles" className="pb-12 md:pb-16 xl:pb-16">
        <Container>
          <p role="status" aria-live="polite" className="sr-only">
            {announce}
          </p>

          {!filtering ? (
            <>
              {/* Featured + picks */}
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                <Link href={`/resources/insights/${featured.slug}`} className="group lg:col-span-7" aria-label={`${featured.title} — read the featured article`}>
                  <ParallaxImage src={featured.image.src} alt={featured.image.alt} speed={0.12} className="aspect-[16/9] rounded-2xl" sizes="(min-width: 1024px) 58vw, 100vw" priority />
                  <p className="mt-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango-text">
                    {categoryLabel(featured.category)}
                    <span className="mx-1.5 text-stone">·</span>
                    <span className="text-slate">{readMinutes(featured)} min read</span>
                    <span className="mx-1.5 text-stone">·</span>
                    Featured
                  </p>
                  <h2 className="mt-3 max-w-[26ch] text-[1.625rem] leading-[1.15] tracking-[-0.02em] transition-colors group-hover:text-mango-text md:text-[2rem]">{featured.title}</h2>
                  <p className="mt-3 max-w-[64ch] text-[15.5px] leading-relaxed text-slate">{featured.summary}</p>
                </Link>
                <Reveal stagger={0.08} as="ul" className="flex flex-col lg:col-span-5 lg:pt-1" aria-label="Editor's picks">
                  {picks.map((a, i) => (
                    <li key={a.slug} className={cn("border-t py-5 first:pt-0 lg:first:border-t-0", i === 0 ? "border-ink" : "border-stone")}>
                      <Link href={`/resources/insights/${a.slug}`} className="group block">
                        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango-text">
                          {categoryLabel(a.category)}
                          <span className="mx-1.5 text-stone">·</span>
                          <span className="text-slate">{readMinutes(a)} min</span>
                        </p>
                        <h3 className="mt-2 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-mango-text md:text-[1.125rem]">{a.title}</h3>
                      </Link>
                    </li>
                  ))}
                </Reveal>
              </div>

              <div className="mt-16 md:mt-20">
                <Reveal y={12} className="mb-6 flex items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">
                  <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-mango-deep" />
                  {insightsHub.allLabel}
                </Reveal>
                <Reveal stagger={0.06} as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                  {rest.map((a) => (
                    <li key={a.slug} className="flex">
                      <ArticleCard article={a} className="w-full" />
                    </li>
                  ))}
                </Reveal>
              </div>
            </>
          ) : (
            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">
                  <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-mango-deep" />
                  {results.length} {results.length === 1 ? "result" : "results"}
                  {filter !== "all" && <> · {categoryLabel(filter)}</>}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink hover:text-mango-text"
                >
                  <X size={14} strokeWidth={2} aria-hidden="true" />
                  Clear filters
                </button>
              </div>
              {results.length ? (
                <Reveal key={`${filter}-${q}`} stagger={0.05} as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                  {results.map((a) => (
                    <li key={a.slug} className="flex">
                      <ArticleCard article={a} className="w-full" />
                    </li>
                  ))}
                </Reveal>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone bg-white p-8 text-center">
                  <p className="font-display text-[1.125rem] font-semibold">No articles match.</p>
                  <p className="mt-2 text-[14.5px] text-slate">Try a different word, or ask us and we&apos;ll write it.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-16 md:mt-20">
            <NewsletterCard />
          </div>
        </Container>
      </Section>
    </>
  );
}
