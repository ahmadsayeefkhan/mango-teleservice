"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { onIntroReady } from "@/components/motion/intro";
import { isLite, isStatic, takeOver, useMediaQuery, useMotionMode } from "@/components/motion/mode";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { hero, proof } from "./home-data";

/**
 * LCP image on every breakpoint (the globe canvas fades in over it on desktop). Preloaded with
 * fetchpriority=high so it is requested before render-blocking CSS/JS finish, never lazy.
 */
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
      className="object-cover object-[35%_40%] lg:object-[70%_40%]"
    />
  );
}

// The host image below stays mounted underneath the globe (fallback={false}), so the LCP element
// is never swapped for a new <img> when the WebGL chunk arrives.
const NetworkGlobe = dynamic(() => import("@/components/three/NetworkGlobe"), { ssr: false, loading: () => null });

const BARS = [0.35, 0.55, 0.45, 0.8, 0.6, 0.95, 0.7, 0.5, 0.85, 0.65, 0.4, 0.9, 0.55, 0.75, 0.6, 0.45];

/**
 * Home hero (Ink): overline, SplitText H1, sub, magnetic primary CTA + secondary, WebGL globe
 * bleeding off-canvas on the right (static image on small screens / while loading), floating
 * "DHAKA CORE · OPERATIONAL" status card, scroll cue, and the proof bar with counters.
 *
 * Performance notes: the WebGL chunk (~230KB) is only requested on wide, full-motion viewports and
 * only once the intro has finished and the main thread is idle, so it never competes with
 * hydration or the hero reveals. The lite tier (touch / < lg) keeps the still image, hides nothing
 * before hydration and enters with CSS keyframes.
 */
export function HomeHero() {
  const section = useRef<HTMLElement>(null);
  const globeWrap = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  // Only mount WebGL on wide screens with motion enabled (mobile / static keep the image).
  const wide = useMediaQuery("(min-width: 1024px)");
  const mode = useMotionMode();
  const [settled, setSettled] = useState(false);
  const webgl = wide && mode === "full" && settled;

  // Defer the globe until the intro is done and the browser is idle (bounded by a 1.5s timeout).
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
      // Scroll progress for the globe (0 at top, 1 when the hero has scrolled away).
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
          // Subtle parallax on the globe while the hero scrolls out.
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
    <section ref={section} data-tone="ink" className="relative overflow-hidden bg-ink text-paper" aria-labelledby="home-hero-title">
      {/* Globe: bleeds off the right edge on desktop (landscape box, Dhaka ~65% / 43%); below lg it gets its own
          landscape band above the copy (static image; WebGL is desktop-only), so copy never overlaps the mask. */}
      <div className="relative lg:absolute lg:inset-y-0 lg:left-[42%] lg:right-[-14%]">
        <div ref={globeWrap} className="js-hide relative aspect-[16/10] w-full sm:aspect-[2/1] lg:absolute lg:inset-0 lg:aspect-auto">
          <GlobeFallback />
          {webgl && <NetworkGlobe className="absolute inset-0" scrollProgress={progress} variant="hero" fallback={false} />}
        </div>
        {/* Blend into the Ink surface */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/35 lg:to-transparent lg:via-30%" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink to-transparent lg:block" />
      </div>

      <Container className="relative">
        <div className="pb-16 pt-6 lg:min-h-[560px] lg:pb-36 lg:pt-20 xl:min-h-[600px]">
          {/* Globe framing contract: keep copy within ~57% of the container width on desktop (Dhaka lands at ~65% of the globe box). */}
          <div className="max-w-[840px] lg:max-w-[57%]">
            <Reveal y={16} className="mb-6" enter={0}>
              <Overline tone="dark">{hero.overline}</Overline>
            </Reveal>
            <SplitHeading
              as="h1"
              id="home-hero-title"
              className="max-w-[26ch] text-[clamp(2.5rem,1.4rem+3vw,3.625rem)] leading-[1.08] tracking-[-0.03em]"
              enter={0.05}
            >
              {hero.title}
            </SplitHeading>
            <Reveal y={24} delay={0.35} className="mt-7 max-w-[52ch] text-body-l text-mist" enter={0.12}>
              <p>{hero.sub}</p>
            </Reveal>
            <Reveal y={24} delay={0.5} className="mt-9 flex flex-wrap gap-3" enter={0.18}>
              <Button href={hero.primary.href} variant="primary" tone="dark" magnetic>
                {hero.primary.label}
              </Button>
              <Button href={hero.secondary.href} variant="secondary" tone="dark" icon="none">
                {hero.secondary.label}
              </Button>
            </Reveal>
          </div>

          {/* Status card */}
          <div
            ref={cardRef}
            className="js-hide lt-enter mt-12 w-full max-w-[340px] md:absolute md:bottom-10 md:right-0 md:mt-0 lg:bottom-16 lg:right-0"
            style={{ "--lt-delay": "0.28s" } as React.CSSProperties}
          >
            <div className="rounded-2xl border border-white/10 bg-graphite/80 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]">
                <span className="text-mist">{hero.statusCard.site}</span>
                <span className="inline-flex items-center gap-1.5 text-signal-green">
                  <span className="status-dot inline-block size-1.5 rounded-full bg-signal-green" />
                  {hero.statusCard.status}
                </span>
              </div>
              <p className="mt-3 font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-paper">{hero.statusCard.systems}</p>
              <div className="mt-4 flex h-9 items-end gap-[3px]" aria-hidden="true">
                {BARS.map((h, i) => (
                  <span
                    key={i}
                    className="signal-bar block w-full rounded-[1px] bg-mango"
                    style={{ height: `${h * 100}%`, ["--bar-min" as string]: `${0.35 + (i % 3) * 0.15}`, ["--bar-delay" as string]: `${(i * 0.13) % 1.6}s`, ["--bar-duration" as string]: `${1.4 + (i % 4) * 0.3}s` }}
                  />
                ))}
              </div>
              <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-mist">{hero.statusCard.footer}</p>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-0 hidden items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-mist lg:flex" aria-hidden="true">
            <span className="relative block h-10 w-px overflow-hidden bg-white/10">
              <span className="scroll-cue-line absolute inset-0 bg-mango" />
            </span>
            Scroll
          </div>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <ProofStrip items={proof} tone="dark" className="bg-transparent" />
      </div>
    </section>
  );
}
