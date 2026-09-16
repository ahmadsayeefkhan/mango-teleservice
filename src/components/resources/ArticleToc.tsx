"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { scrollTo } from "@/components/motion/lenis-store";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/**
 * Sticky "On this page" list with scroll-spy and a reading-progress Signal Line: the rail fills and
 * the Mango dot travels down the list as the reader moves through the article body
 * (`[data-article-body]`). Mobile: horizontal chip row. Scroll-spy is functional UI, so it stays
 * live in static mode; only the smoothing is dropped there.
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useGSAP(
    () => {
      const body = document.querySelector<HTMLElement>("[data-article-body]");
      if (!body) return;
      const sections = Array.from(body.querySelectorAll<HTMLElement>("[data-section]"));
      const triggers: ScrollTrigger[] = [];

      sections.forEach((sec) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (self) => {
              if (self.isActive) setActive(sec.id);
            },
          }),
        );
      });

      const setProgress = (p: number) => {
        if (fill.current) gsap.set(fill.current, { scaleY: p });
        if (dot.current) gsap.set(dot.current, { top: `${p * 100}%` });
      };
      triggers.push(
        ScrollTrigger.create({
          trigger: body,
          start: "top 45%",
          end: "bottom 45%",
          onUpdate: (self) => setProgress(self.progress),
          onRefresh: (self) => setProgress(self.progress),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root, dependencies: [] },
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
    <div ref={root}>
      <p className="mb-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate">On this page</p>

      {/* Desktop: vertical list with reading-progress rail */}
      <nav aria-label="Table of contents" className="hidden lg:block">
        <div className="relative pl-5">
          <span aria-hidden="true" className="absolute inset-y-1 left-0 w-0.5 bg-stone">
            <span ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-mango-deep" />
            <span ref={dot} className="signal-dot absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mango" />
          </span>
          <ol className="flex flex-col gap-2.5">
            {items.map((it) => (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  onClick={go(it.id)}
                  aria-current={active === it.id ? "location" : undefined}
                  className={cn(
                    "block text-[13.5px] leading-snug transition-colors duration-300",
                    active === it.id ? "font-semibold text-ink" : "text-slate hover:text-ink",
                  )}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Mobile: chip row */}
      <nav aria-label="Table of contents" className="-mx-5 overflow-x-auto px-5 lg:hidden [scrollbar-width:none]">
        <ol className="flex w-max gap-2 pb-1">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={go(it.id)}
                aria-current={active === it.id ? "location" : undefined}
                className={cn(
                  "inline-flex h-9 items-center whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors",
                  active === it.id ? "border-ink bg-ink text-paper" : "border-stone bg-white text-slate",
                )}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
