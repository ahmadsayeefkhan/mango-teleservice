"use client";

import { Suspense, useRef } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Verify } from "@/components/ui/Verify";
import { network } from "@/content/company";
import { cn } from "@/lib/utils";
import { LayerVisual } from "./LayerVisuals";

const layers = network.layers.items;

/**
 * The four network layers. Desktop (full motion): the stage is pinned for ~4 screens; a scrubbed
 * timeline steps through the layers, dimming inactive rows, crossfading the brand diagram in the
 * panel and ticking the 01→04 counter, while a vertical Signal rail fills. Mobile / static: rows
 * stack in flow, each with its own diagram, and the panel shows the first layer.
 */
export function NetworkLayers() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const st = stage.current;
      if (!st || isStatic()) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const rows = Array.from(st.querySelectorAll<HTMLElement>("[data-row]"));
        const visuals = Array.from(st.querySelectorAll<HTMLElement>("[data-visual]"));
        const counter = st.querySelector<HTMLElement>("[data-counter]");
        const label = st.querySelector<HTMLElement>("[data-label]");
        const fill = st.querySelector<HTMLElement>("[data-rail-fill]");
        const dot = st.querySelector<HTMLElement>("[data-rail-dot]");
        const n = layers.length;

        gsap.set(visuals, { autoAlpha: 0, y: 28 });
        gsap.set(visuals[0], { autoAlpha: 1, y: 0 });
        rows[0].setAttribute("data-active", "true");

        let active = 0;
        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          rows.forEach((r, k) => r.setAttribute("data-active", String(k === i)));
          if (counter) counter.textContent = layers[i].code;
          if (label) label.textContent = layers[i].label;
        };

        // Inactive rows dim as the stage approaches rather than at load: the page never sits with
        // low-contrast text (WCAG / axe), and the dim reads as the first beat of the sequence.
        ScrollTrigger.create({
          trigger: st,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.to(
              rows.filter((_, k) => k !== active),
              { opacity: 0.32, duration: 0.5, ease: "power2.out" },
            );
          },
        });

        // Readouts follow the *scrubbed* timeline (its onUpdate), not the raw scroll event, so the
        // counter, rail and active row stay in sync with the crossfade while the scrub catches up.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: st,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 0.9 * n)}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: function (this: gsap.core.Timeline) {
            const p = this.progress();
            if (fill) gsap.set(fill, { scaleY: p });
            if (dot) gsap.set(dot, { top: `${p * 100}%` });
            setActive(Math.min(n - 1, Math.max(0, Math.round(this.time() - 0.25))));
          },
        });
        for (let i = 1; i < n; i++) {
          tl.to(visuals[i - 1], { autoAlpha: 0, y: -28, duration: 0.5, ease: "power2.inOut" }, i)
            .fromTo(visuals[i], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.inOut" }, i + 0.12)
            .to(rows[i - 1], { opacity: 0.32, duration: 0.35, ease: "power2.inOut" }, i)
            .to(rows[i], { opacity: 1, duration: 0.35, ease: "power2.inOut" }, i);
        }
        tl.to({}, { duration: 0.5 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} data-tone="paper" className="cv-auto bg-paper pt-20 text-ink md:pt-28 xl:pt-32" aria-labelledby="layers-title">
      <Container>
        <SectionHeader overline={network.layers.overline} title={network.layers.title} intro={network.layers.intro} align="split" id="layers-title" className="mb-4 md:mb-6" />
      </Container>

      {/* Pinned stage: full-viewport height only when motion is on (static mode flows normally). */}
      <div ref={stage} className="pb-20 md:pb-28 lg:flex lg:flex-col lg:justify-center lg:[[data-motion=full]_&]:min-h-screen lg:[[data-motion=full]_&]:pb-0">
        <Container className="lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Rows */}
            <div className="flex gap-5 lg:col-span-5 lg:gap-7">
              <div aria-hidden="true" className="relative hidden w-0.5 shrink-0 self-stretch bg-ink/10 lg:block">
                <span data-rail-fill className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-mango-deep" />
                <span data-rail-dot className="signal-dot absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mango" />
              </div>
              <ol className="flex flex-1 flex-col divide-y divide-stone lg:divide-y-0">
                {layers.map((l, i) => (
                  <li key={l.code} data-row data-active={i === 0 ? "true" : "false"} className="group/row py-7 first:pt-0 last:pb-0 lg:py-5">
                    <div className="grid grid-cols-[3.25rem_1fr] gap-4 md:grid-cols-[4rem_1fr]">
                      <span className="font-mono text-[1.5rem] font-medium leading-none tracking-[-0.02em] text-slate transition-colors duration-300 group-data-[active=true]/row:text-mango-text md:text-[1.75rem]">
                        {l.code}
                      </span>
                      <div>
                        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">{l.label}</p>
                        <h3 className="mt-2 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.015em] md:text-[1.375rem]">{l.title}</h3>
                        <p className="mt-2.5 max-w-[46ch] text-[15px] leading-relaxed text-slate">{l.verify ? <Verify note={l.verify}>{l.body}</Verify> : l.body}</p>
                        {/* Mobile / tablet: diagram inline. Each SVG hydrates in its own task (Suspense). */}
                        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-ink lg:hidden">
                          <Suspense>
                            <LayerVisual kind={l.key} />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Panel (desktop) */}
            <Reveal y={32} className="hidden lg:col-span-7 lg:block">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink text-paper">
                <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(254,202,38,0.10),transparent)]" />
                <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]">
                  <span className="text-mist">
                    Layer <span data-counter className="text-mango">{layers[0].code}</span> / {layers[layers.length - 1].code}
                  </span>
                  <span data-label className="text-paper/80">
                    {layers[0].label}
                  </span>
                </div>
                <div className="relative aspect-[16/10]">
                  {layers.map((l, i) => (
                    <div key={l.code} data-visual className={cn("absolute inset-0 p-4", i === 0 ? "opacity-100" : "opacity-0")}>
                      <Suspense>
                        <LayerVisual kind={l.key} className="h-full w-full" />
                      </Suspense>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
