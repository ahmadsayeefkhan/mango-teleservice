"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, MEDIA, ScrollTrigger, useGSAP, onceTrigger } from "@/components/motion/gsap";
import { isStatic, takeOver } from "@/components/motion/mode";
import { cn, pad } from "@/lib/utils";
import { layerMeta, type IndustryStackRow } from "@/content/industries";

/**
 * Signature motion for the Industries area: the recommended solution stack assembles as you scroll.
 * A vertical Signal Line runs down the left of the rows; its fill and travelling Mango dot are
 * scrubbed by scroll, each row slides into place as the dot reaches it and its rail node lights up.
 * Mobile: one-shot staggered rise (no scrub). Static / reduced motion: final state, all nodes lit.
 */
export function StackAssembly({ rows, ariaLabel = "Recommended solution stack" }: { rows: IndustryStackRow[]; ariaLabel?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !fill.current || !dot.current) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-row]"));
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
      const setActive = (n: number) => nodes.forEach((node, i) => node.setAttribute("data-active", String(i < n)));

      if (isStatic()) {
        items.forEach(takeOver);
        setActive(items.length);
        gsap.set(fill.current, { scaleY: 1 });
        gsap.set(dot.current, { top: "60%" });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        gsap.set(items, { opacity: 0, y: 64, scale: 0.97, transformOrigin: "50% 0%", willChange: "transform, opacity" });
        items.forEach(takeOver);
        setActive(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 62%",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(items.length, Math.floor(self.progress * items.length + 0.35))),
            // Short page safety: if the trigger can never be scrolled through, show the final state.
            onRefresh: (self) => {
              if (self.start >= ScrollTrigger.maxScroll(window) - 1) {
                tl.progress(1);
                setActive(items.length);
              }
            },
          },
        });

        const per = 1 / items.length;
        tl.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
        tl.fromTo(dot.current, { top: "0%" }, { top: "100%", duration: 1 }, 0);
        items.forEach((item, i) => {
          tl.to(item, { opacity: 1, y: 0, scale: 1, duration: per * 0.85, ease: "power2.out" }, Math.max(0, i * per - per * 0.25));
        });
        tl.set(items, { clearProps: "willChange" }, 1);
      });

      mm.add(MEDIA.mobile, () => {
        gsap.set(items, { opacity: 0, y: 28 });
        items.forEach(takeOver);
        setActive(items.length);
        gsap.to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: onceTrigger(el, "top 85%") });
        gsap.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
        gsap.fromTo(dot.current, { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div ref={root} className="relative pl-8 md:pl-12">
      {/* Vertical Signal Line */}
      <div aria-hidden="true" className="absolute inset-y-3 left-[7px] w-0.5 bg-ink/10 md:left-[11px]">
        <span ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-mango-deep" />
        <span ref={dot} className="signal-dot absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mango" />
      </div>

      <ol className="flex flex-col gap-3 md:gap-4" aria-label={ariaLabel}>
        {rows.map((row, i) => {
          const meta = layerMeta[row.layer];
          return (
            <li key={row.href + row.title} data-row className="js-hide relative">
              {/* Rail node */}
              <span
                data-node
                data-active="false"
                aria-hidden="true"
                className="absolute -left-8 top-1/2 size-3.5 translate-x-px -translate-y-1/2 rounded-full border-2 border-stone bg-paper transition-[background-color,border-color,transform] duration-300 data-[active=true]:scale-110 data-[active=true]:border-mango data-[active=true]:bg-mango md:-left-12 md:translate-x-[5px]"
              />
              <Link
                href={row.href}
                className="group flex items-center gap-4 rounded-2xl border border-stone bg-white p-4 transition-[border-color,transform] duration-300 ease-out-expo hover:border-ink/60 md:gap-6 md:px-6 md:py-5"
              >
                <span className="w-7 shrink-0 font-mono text-[15px] font-medium tracking-[0.04em] text-mango-text md:w-8 md:text-[1.0625rem]">{pad(i + 1)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-mango-text md:text-[1.125rem]">
                    {row.title}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-slate md:text-[14px]">{row.line}</span>
                </span>
                <span
                  className={cn(
                    "hidden shrink-0 items-center rounded-full border border-stone px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper sm:inline-flex",
                  )}
                  title={meta.desc}
                >
                  {row.layer}
                </span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="shrink-0 text-mango-deep transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <span className="sr-only">, {meta.label} layer</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
