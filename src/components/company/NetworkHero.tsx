"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { onIntroReady } from "@/components/motion/intro";
import { isLite, isStatic, takeOver, useMediaQuery, useMotionMode } from "@/components/motion/mode";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { network } from "@/content/company";

/** LCP image on every breakpoint; preloaded at high priority (see HomeHero). */
function GlobeFallback() {
  return (
    <Image
      src="/images/hero-network-globe.png"
      alt=""
      fill
      sizes="(min-width: 1024px) 60vw, 100vw"
      preload
      fetchPriority="high"
      loading="eager"
      // lg framing matches NetworkGlobe's own fallback (70% 40%) so the deferred WebGL mount swaps in without a jump.
      className="object-cover object-[40%_45%] lg:object-[70%_40%]"
    />
  );
}

// The host image stays mounted underneath the globe (fallback={false}): no LCP element swap.
const NetworkGlobe = dynamic(() => import("@/components/three/NetworkGlobe"), { ssr: false, loading: () => null });

/**
 * Network hero (Ink): crumb, overline, SplitText H1, sub, CTAs; WebGL globe (network variant,
 * scroll-linked) bleeding off the right edge; route status card; proof strip.
 * Mobile / static keep the still image. The WebGL chunk is requested only after the intro, when
 * the main thread is idle (see HomeHero for the rationale).
 */
export function NetworkHero() {
  const section = useRef<HTMLElement>(null);
  const globeWrap = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const wide = useMediaQuery("(min-width: 1024px)");
  const mode = useMotionMode();
  const [settled, setSettled] = useState(false);
  const webgl = wide && mode === "full" && settled;

  useEffect(() => {
    if (!wide || mode !== "full") return;
    let idle: number | undefined;
    const cancel = onIntroReady(() => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(() => setSettled(true), { timeout: 1500 });
      else idle = window.setTimeout(() => setSettled(true), 300);
    });
    return () => {
      cancel();
      if (idle !== undefined) {
        const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        if (cic) cic(idle);
        clearTimeout(idle);
      }
    };
  }, [wide, mode]);

  useGSAP(
    (_, contextSafe) => {
      const el = section.current;
      const g = globeWrap.current;
      if (!el || !g) return;
      if (isStatic() || isLite()) {
        takeOver(g);
        takeOver(cardRef.current);
        return;
      }
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      gsap.set(g, { opacity: 0, scale: 1.06, transformOrigin: "60% 40%" });
      takeOver(g);
      gsap.set(cardRef.current, { opacity: 0, y: 24 });
      takeOver(cardRef.current);
      const cancel = onIntroReady(
        contextSafe!(() => {
          gsap.to(g, { opacity: 1, scale: 1, duration: 1.8, ease: "expo.out", delay: 0.1 });
          gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 });
          gsap.to(g, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        }),
      );
      return () => cancel();
    },
    { scope: section, dependencies: [] },
  );

  return (
    <header ref={section} data-tone="ink" className="relative overflow-hidden bg-ink text-paper" aria-labelledby="network-hero-title">
      <div className="relative lg:absolute lg:inset-y-0 lg:left-[40%] lg:right-[-16%]">
        <div ref={globeWrap} className="js-hide relative aspect-[16/10] w-full sm:aspect-[2/1] lg:absolute lg:inset-0 lg:aspect-auto">
          <GlobeFallback />
          {webgl && <NetworkGlobe className="absolute inset-0" scrollProgress={progress} variant="network" fallback={false} />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/35 lg:to-transparent lg:via-30%" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink to-transparent lg:block" />
      </div>

      <Container className="relative">
        <div className="pb-16 pt-6 lg:min-h-[560px] lg:pb-32 lg:pt-10 xl:min-h-[600px]">
          <Reveal y={12} className="mb-8" enter={0}>
            <Breadcrumbs items={network.crumb} tone="dark" />
          </Reveal>
          <div className="max-w-[820px]">
            <Reveal y={16} className="mb-5" enter={0.03}>
              <Overline tone="dark">{network.overline}</Overline>
            </Reveal>
            <SplitHeading as="h1" id="network-hero-title" className="text-h1 max-w-[18ch] text-balance" enter={0.06}>
              {network.title}
            </SplitHeading>
            <Reveal y={24} delay={0.3} className="mt-6 max-w-[52ch] text-body-l text-mist" enter={0.12}>
              <p>{network.sub}</p>
            </Reveal>
            <Reveal y={24} delay={0.45} className="mt-9 flex flex-wrap gap-3" enter={0.18}>
              <Button href={network.primary.href} variant="primary" tone="dark" magnetic>
                {network.primary.label}
              </Button>
              <Button href={network.secondary.href} variant="secondary" tone="dark" icon="none">
                {network.secondary.label}
              </Button>
            </Reveal>
          </div>

          {/* Route status card */}
          <div
            ref={cardRef}
            className="js-hide lt-enter mt-12 w-full max-w-[340px] md:absolute md:bottom-10 md:right-0 md:mt-0 lg:bottom-14"
            style={{ "--lt-delay": "0.28s" } as React.CSSProperties}
          >
            <div className="rounded-2xl border border-white/10 bg-graphite/80 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]">
                <span className="text-mist">{network.statusCard.site}</span>
                <span className="inline-flex items-center gap-1.5 text-signal-green">
                  <span className="status-dot inline-block size-1.5 rounded-full bg-signal-green" />
                  {network.statusCard.status}
                </span>
              </div>
              <p className="mt-3 font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-paper">{network.statusCard.systems}</p>
              <ul className="mt-4 space-y-2" aria-label="Routes">
                {["SEA-ME-WE 4", "SEA-ME-WE 5", "ITC terrestrial"].map((r, i) => (
                  <li key={r} className="flex items-center gap-3 text-[12.5px] text-paper/85">
                    <span className="relative block h-px flex-1 bg-white/10">
                      <span className="signal-dot absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-mango" style={{ left: `${30 + i * 22}%` }} />
                    </span>
                    <span className="w-[112px] shrink-0 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-mist">{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-mist">{network.statusCard.footer}</p>
            </div>
          </div>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <ProofStrip items={network.proof} tone="dark" className="bg-transparent" />
      </div>
    </header>
  );
}
