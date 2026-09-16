"use client";

import { useRef } from "react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Reveal } from "@/components/motion/Reveal";
import { SignalLine } from "@/components/motion/SignalLine";
import { Container } from "@/components/ui/Container";
import { Verify } from "@/components/ui/Verify";
import { milestones, type Milestone } from "@/content/company";
import { cn } from "@/lib/utils";

const items = milestones.items;

function Legend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate", className)} aria-label="Legend">
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-mango" />
        {milestones.legend.mango}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="size-2.5 rounded-full border-[1.5px] border-ink/50 bg-transparent" />
        {milestones.legend.group}
      </li>
    </ul>
  );
}

function Tick({ m, className }: { m: Milestone; className?: string }) {
  return <span aria-hidden="true" className={cn("block size-3 rounded-full border-2", m.track === "mango" ? "border-mango bg-mango" : "border-ink/50 bg-paper", className)} />;
}

function Body({ m, dark }: { m: Milestone; dark?: boolean }) {
  const text = m.verify ? <Verify note={m.verify}>{m.body}</Verify> : m.body;
  return (
    <>
      <h3 className={cn("font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]", m.track === "group" && !dark && "text-ink/75")}>{m.title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate">{text}</p>
      <span className="sr-only">{m.track === "mango" ? "Mango Teleservices" : "Mango Group"}</span>
    </>
  );
}

/**
 * Milestones timeline.
 * Desktop + full motion: the stage pins for the length of the track; the track scrolls
 * horizontally under a fixed Signal rail whose Mango dot crosses the viewport, lighting up each
 * milestone as it passes while the year readout ticks. Mobile / static: vertical rail.
 * Both variants are server-rendered; CSS (data-motion + breakpoint) decides which one shows.
 */
export function MilestoneTimeline() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const st = stage.current;
      const tr = track.current;
      if (!st || !tr || isStatic()) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const nodes = Array.from(tr.querySelectorAll<HTMLElement>("[data-h-item]"));
        const ticks = Array.from(tr.querySelectorAll<HTMLElement>("[data-h-tick]"));
        const fill = st.querySelector<HTMLElement>("[data-h-fill]");
        const dot = st.querySelector<HTMLElement>("[data-h-dot]");
        const yearBig = st.querySelector<HTMLElement>("[data-year-big]");
        const yearSmall = st.querySelector<HTMLElement>("[data-year-small]");
        const counter = st.querySelector<HTMLElement>("[data-h-counter]");
        const dist = () => Math.max(0, tr.scrollWidth - window.innerWidth);

        let active = -1;
        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          nodes.forEach((n, k) => n.setAttribute("data-active", String(k <= i)));
          const y = items[i]?.year ?? items[0].year;
          if (yearBig) yearBig.setAttribute("data-year", y);
          if (yearSmall) yearSmall.textContent = y;
          if (counter) counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
        };
        setActive(0);

        // Geometry is measured once per refresh (resize / font load), never inside onUpdate: the
        // scrubbed tween runs every frame and a getBoundingClientRect() there forced a synchronous
        // layout on each of them. Tick centres are stored relative to the track, so the track's
        // current translate is the only thing that changes per frame.
        let distance = 0;
        let trackLeft = 0;
        let tickX: number[] = [];
        let viewport = 0;
        const measure = () => {
          distance = dist();
          viewport = window.innerWidth;
          const base = tr.getBoundingClientRect().left;
          trackLeft = base - (Number(gsap.getProperty(tr, "x")) || 0);
          tickX = ticks.map((t) => {
            const r = t.getBoundingClientRect();
            return r.left + r.width / 2 - base;
          });
        };
        measure();

        // Inactive items dim only as the stage reaches its pin (not while it merely sits in the first
        // viewport under the hero), so the page never sits with low-contrast text at load and the
        // dim reads as the first beat of the scrubbed sequence.
        ScrollTrigger.create({ trigger: st, start: "top 12%", once: true, onEnter: () => st.setAttribute("data-armed", "true") });

        // Rail, dot and readouts follow the scrubbed tween (its onUpdate), so they stay in step with
        // the moving track rather than jumping ahead on the raw scroll event.
        gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: st,
            start: "top top",
            end: () => `+=${dist() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: measure,
          },
          // `this` = the tween (onUpdate can fire during creation, before a const binding exists).
          onUpdate: function (this: gsap.core.Tween) {
            const p = this.progress();
            if (fill) gsap.set(fill, { scaleX: p });
            if (dot) gsap.set(dot, { left: `${p * 100}%` });
            const dx = p * viewport;
            const shift = trackLeft - distance * p;
            let a = 0;
            for (let i = 0; i < tickX.length; i++) {
              if (tickX[i] + shift <= dx + 4) a = i;
            }
            setActive(a);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} data-tone="paper" className="cv-auto bg-paper text-ink" aria-labelledby="timeline-title">
      {/* Keeps the heading outline sequential (h1 → h2 → milestone h3s) for assistive tech and axe. */}
      <h2 id="timeline-title" className="sr-only">
        Timeline
      </h2>
      {/* ---------- Horizontal (desktop, full motion) ---------- */}
      <div ref={stage} className="hidden lg:[[data-motion=full]_&]:block">
        <div className="relative flex h-screen flex-col justify-center overflow-hidden">
          {/* Decorative watermark year, painted from a CSS pseudo-element (content: attr()) rather than DOM
              text: it is 4.5% ink on paper by design, and axe would otherwise audit it for contrast. */}
          <span
            data-year-big
            data-year={items[0].year}
            aria-hidden="true"
            className="pointer-events-none absolute right-[4vw] top-[8vh] select-none font-display text-[clamp(8rem,18vw,16rem)] font-bold leading-none tracking-[-0.04em] text-ink/[0.045] after:content-[attr(data-year)]"
          />
          <Container className="relative mb-10 flex items-end justify-between">
            <Legend />
            <p className="flex items-baseline gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
              <span data-h-counter>01 / {String(items.length).padStart(2, "0")}</span>
              <span data-year-small className="font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                {items[0].year}
              </span>
            </p>
          </Container>

          <div className="relative w-full">
            {/* Fixed rail (viewport-wide) */}
            <div aria-hidden="true" className="absolute inset-x-0 top-[47px] h-0.5 bg-ink/10">
              <span data-h-fill className="absolute inset-0 origin-left scale-x-0 bg-mango-deep" />
            </div>
            <span data-h-dot aria-hidden="true" className="signal-dot absolute top-[48px] z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mango" style={{ left: 0 }} />
            {/* Moving track */}
            <ol ref={track} className="relative flex w-max pl-[max(1.25rem,calc((100vw-1200px)/2))] pr-[12vw]">
              {items.map((m, i) => (
                <li key={`${m.year}-${i}`} data-h-item data-active="false" className="group/h w-[320px] shrink-0 pr-10 transition-opacity duration-500 [[data-armed]_&]:data-[active=false]:opacity-45 xl:w-[340px]">
                  <span className="block h-8 font-mono text-[13px] font-medium tracking-[0.06em] text-mango-text">{m.year}</span>
                  <span className="relative flex h-8 items-center">
                    <Tick m={m} className="relative transition-transform duration-500 group-data-[active=true]/h:scale-125" />
                    <span data-h-tick aria-hidden="true" className="absolute left-0 top-1/2 size-3" />
                  </span>
                  <div className="mt-4 max-w-[26ch]">
                    <Body m={m} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Container className="mt-14 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-slate">
            <span aria-hidden="true">Scroll to travel the timeline →</span>
          </Container>
        </div>
      </div>

      {/* ---------- Vertical (mobile / tablet / static) ---------- */}
      <div className="py-20 md:py-28 lg:[[data-motion=full]_&]:hidden">
        <Container>
          <Reveal y={12}>
            <Legend className="mb-10" />
          </Reveal>
          <div className="flex gap-5 md:gap-8">
            <div className="hidden w-20 shrink-0 md:block" aria-hidden="true" />
            <SignalLine orientation="vertical" progress="scroll" tone="light" start="top 65%" end="bottom 70%" className="bg-ink/10" />
            <Reveal stagger={0.06} as="ol" className="flex flex-1 flex-col gap-8 md:gap-9">
              {items.map((m, i) => (
                <li key={`${m.year}-${i}`} className="relative md:grid md:grid-cols-[1fr] md:pl-0">
                  <Tick m={m} className="absolute -left-[27px] top-1.5 md:-left-[39px]" />
                  <span className="absolute -left-[8.5rem] top-0.5 hidden w-20 whitespace-nowrap text-right font-mono text-[12.5px] font-medium tracking-[0.06em] text-mango-text md:block">{m.year}</span>
                  <span className="block font-mono text-[12px] font-medium tracking-[0.08em] text-mango-text md:hidden">{m.year}</span>
                  <div className="mt-1 max-w-[56ch] md:mt-0">
                    <Body m={m} />
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
