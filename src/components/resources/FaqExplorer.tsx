"use client";

import { useDeferredValue, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { scrollTo } from "@/components/motion/lenis-store";
import { Reveal } from "@/components/motion/Reveal";
import { HubHero } from "@/components/industries/HubHero";
import { FAQ } from "@/components/sections/FAQ";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { cn } from "@/lib/utils";
import { faqHub, type FaqGroup } from "@/content/resources";

function hit(q: string, ...fields: string[]) {
  if (!q) return true;
  const hay = fields.join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

/**
 * FAQ hub: hero search filters questions live; sticky category nav with scroll-spy; grouped
 * accordions built on the foundation <FAQ bare>. Result counts announced via aria-live.
 */
export function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim());
  const inputId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(groups[0]?.id ?? "");

  const visible = useMemo(
    () => groups.map((g) => ({ ...g, items: g.items.filter((it) => hit(q, it.q, it.a)) })).filter((g) => g.items.length > 0),
    [groups, q],
  );
  const total = visible.reduce((n, g) => n + g.items.length, 0);
  const all = groups.reduce((n, g) => n + g.items.length, 0);

  // Scroll-spy over the rendered groups (re-run when the visible set changes).
  useGSAP(
    () => {
      const secs = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-faq-group]") ?? []);
      const triggers = secs.map((sec) =>
        ScrollTrigger.create({
          trigger: sec,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActive(sec.dataset.faqGroup ?? "");
          },
        }),
      );
      if (secs[0] && !secs.some((s) => s.dataset.faqGroup === active)) setActive(secs[0].dataset.faqGroup ?? "");
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root, dependencies: [visible.map((g) => g.id).join("|")] },
  );

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    scrollTo(el, -112);
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <>
      <HubHero crumb={[{ label: "Resources" }, { label: "FAQ" }]} overline={faqHub.overline} title={faqHub.title} sub={faqHub.sub}>
        <Reveal y={16} delay={0.3} className="mt-9">
          <div className="relative w-full max-w-[440px]">
            <label htmlFor={inputId} className="sr-only">
              Search questions
            </label>
            <Search size={17} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={faqHub.searchPlaceholder}
              autoComplete="off"
              className="h-[52px] w-full rounded-lg border border-white/15 bg-white pl-12 pr-11 text-[15.5px] text-ink placeholder:text-slate/80 focus-visible:outline-mango [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-slate hover:text-ink">
                <X size={15} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
          <p role="status" aria-live="polite" className={cn("mt-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]", q ? "text-mango" : "text-mist")}>
            {q ? `${total} of ${all} questions match “${q}”` : `${all} questions in ${groups.length} categories`}
          </p>
        </Reveal>
      </HubHero>

      <Section tone="paper" id="questions" aria-label="Questions">
        <Container>
          <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Category nav */}
            <nav aria-label="FAQ categories" className="min-w-0 lg:col-span-3">
              <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] lg:sticky lg:top-28 lg:mx-0 lg:overflow-visible lg:px-0">
                <ul className="flex w-max gap-2 pb-1 lg:w-auto lg:flex-col lg:gap-1 lg:pb-0">
                  {groups.map((g) => {
                    const shown = visible.some((v) => v.id === g.id);
                    const on = active === g.id && shown;
                    return (
                      <li key={g.id}>
                        <a
                          href={`#${g.id}`}
                          onClick={go(g.id)}
                          aria-current={on ? "location" : undefined}
                          aria-disabled={!shown || undefined}
                          tabIndex={shown ? undefined : -1}
                          className={cn(
                            "flex h-10 items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3.5 text-[13.5px] font-medium transition-colors duration-200",
                            on ? "bg-ink text-paper" : "text-slate hover:bg-white hover:text-ink",
                            !shown && "pointer-events-none opacity-35",
                          )}
                        >
                          {g.label}
                          <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className={cn("hidden transition-opacity lg:block", on ? "opacity-100" : "opacity-0")} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            {/* Groups */}
            <div className="min-w-0 lg:col-span-9">
              {visible.length ? (
                <div className="flex flex-col gap-12 md:gap-14">
                  {visible.map((g, gi) => (
                    <section key={g.id} id={g.id} data-faq-group={g.id} className="scroll-mt-28" aria-labelledby={`${g.id}-label`}>
                      <p id={`${g.id}-label`} className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango-text">
                        {g.label}
                      </p>
                      <FAQ
                        key={`${g.id}-${q}`}
                        bare
                        defaultOpen={q ? 0 : gi === 0 ? 0 : -1}
                        items={g.items.map((it) => ({ q: it.q, a: it.verify ? <Verify note={it.verify}>{it.a}</Verify> : it.a }))}
                      />
                    </section>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone bg-white p-8 text-center">
                  <p className="font-display text-[1.125rem] font-semibold">No matching questions.</p>
                  <p className="mt-2 text-[14.5px] text-slate">{faqHub.noResults}</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
