"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Overline";
import { cn } from "@/lib/utils";
import { services, type ServiceLayer } from "./home-data";

/**
 * "One partner for every layer": on desktop the intro column is pinned (sticky) while the four
 * layer cards stack over each other as you scroll; a vertical Signal Line and the step list track
 * progress (scrubbed). On mobile / static the cards simply stack in flow.
 */
export function ServicesStory() {
  const root = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const railDot = useRef<HTMLSpanElement>(null);
  const railFill = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const cards = cardsRef.current;
      if (!cards || isStatic()) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const wrappers = Array.from(cards.querySelectorAll<HTMLElement>("[data-card-wrap]"));
        const steps = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-step]"));
        const total = wrappers.length;

        // Progress: from first card reaching its sticky top to last card reaching it.
        ScrollTrigger.create({
          trigger: cards,
          start: "top 140px",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            if (railDot.current) gsap.set(railDot.current, { yPercent: 0, top: `${p * 100}%` });
            if (railFill.current) gsap.set(railFill.current, { scaleY: p });
            const active = Math.min(total - 1, Math.floor(p * total + 0.15));
            steps.forEach((s, i) => s.setAttribute("data-active", String(i === active)));
          },
        });

        // As card i+1 rises over card i, card i recedes.
        wrappers.forEach((wrap, i) => {
          const card = wrap.querySelector<HTMLElement>("[data-card]");
          const next = wrappers[i + 1];
          if (!card || !next) return;
          gsap.to(card, {
            scale: 0.95,
            opacity: 0.7,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 140px", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} data-tone="paper" className="cv-auto bg-paper py-20 text-ink md:py-28 xl:py-32" aria-labelledby="services-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Sticky intro column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[140px]">
              <Reveal y={16} className="mb-4">
                <Overline>{services.overline}</Overline>
              </Reveal>
              <SplitHeading as="h2" id="services-title" className="text-h2 max-w-[16ch]">
                {services.title}
              </SplitHeading>
              <Reveal y={24} delay={0.15} className="mt-6 max-w-[46ch] text-body-l text-slate">
                <p>{services.intro}</p>
              </Reveal>

              {/* Step list + vertical Signal Line (desktop) */}
              <Reveal y={24} delay={0.25} className="mt-10 hidden lg:block">
                <ol className="relative border-l-2 border-stone pl-6">
                  <span ref={railFill} aria-hidden="true" className="absolute -left-0.5 top-0 h-full w-0.5 origin-top scale-y-0 bg-mango-deep" />
                  <span ref={railDot} aria-hidden="true" className="signal-dot absolute -left-[7px] top-0 size-3 -translate-y-1/2 rounded-full bg-mango" />
                  {services.layers.map((l) => (
                    <li
                      key={l.code}
                      data-step
                      data-active="false"
                      className="group/step flex items-baseline gap-3 py-2 font-display text-[1.0625rem] font-semibold text-slate transition-colors duration-300 data-[active=true]:text-ink"
                    >
                      <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-mist group-data-[active=true]/step:text-mango-text">{l.code}</span>
                      {l.label}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>

          {/* Cards */}
          <div ref={cardsRef} className="flex flex-col gap-5 lg:col-span-7 lg:gap-0">
            {services.layers.map((layer, i) => (
              <div key={layer.code} data-card-wrap className={cn("story-wrap", i < services.layers.length - 1 && "lg:min-h-[600px]")}>
                <Reveal y={40} className="story-sticky lg:sticky" style={{ top: `${140 + i * 14}px` }}>
                  <LayerCard layer={layer} index={i} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function LayerCard({ layer, index }: { layer: ServiceLayer; index: number }) {
  const ink = index === 0;
  return (
    <article
      data-card
      data-tone={ink ? "ink" : "paper"}
      className={cn(
        "relative flex flex-col rounded-3xl border p-6 md:p-8 lg:min-h-[420px]",
        ink ? "border-white/10 bg-ink text-paper" : "border-stone bg-white text-ink",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("inline-flex size-12 items-center justify-center rounded-xl", ink ? "bg-mango text-ink" : "bg-stone/60 text-ink")}>
          <Icon icon={layer.icon} size={22} />
        </span>
        <span className={cn("font-mono text-[11px] font-medium uppercase tracking-[0.12em]", ink ? "text-mist" : "text-slate")}>
          {layer.code} / {layer.label}
        </span>
      </div>
      <h3 className="mt-8 text-h3 max-w-[16ch]">{layer.title}</h3>
      <p className={cn("mt-4 max-w-[48ch] text-[15.5px] leading-relaxed", ink ? "text-mist" : "text-slate")}>{layer.body}</p>
      <ul className={cn("mt-auto divide-y pt-8", ink ? "divide-white/10" : "divide-stone")}>
        {layer.links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={cn(
                "group/link flex items-center justify-between py-3 text-[14.5px] font-semibold transition-colors",
                ink ? "hover:text-mango" : "hover:text-mango-text",
              )}
            >
              {l.label}
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" className={cn("transition-transform duration-300 ease-out-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5", ink ? "text-mango" : "text-mango-deep")} />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
