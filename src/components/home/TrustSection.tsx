import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/motion/Marquee";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { trust } from "./home-data";

/** Home §07 — Trust: NBR story image card (clip reveal + parallax), hosting proof, licensed-by, client logo marquee. */
export function TrustSection() {
  const s = trust.story;
  return (
    <Section tone="paper" id="trust" ariaLabelledby="trust-title">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Story card */}
          <Link href={s.href} className="group relative block overflow-hidden rounded-3xl lg:col-span-7" aria-label={`${s.title} — read the story`}>
            <ParallaxImage src={s.image} alt={s.alt} speed={0.12} className="aspect-[4/3] w-full rounded-3xl sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[460px]" sizes="(min-width: 1024px) 58vw, 100vw" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-paper md:p-8">
              <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango">{s.kicker}</p>
              <p className="max-w-[20ch] font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.75rem]">{s.title}</p>
              <p className="mt-2 max-w-[56ch] text-[14px] leading-relaxed text-paper/80">{s.body}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold">
                Read the story
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Proof card */}
          <Reveal y={32} delay={0.1} className="flex flex-col rounded-3xl border border-stone bg-white p-6 md:p-8 lg:col-span-5">
            <Overline className="mb-5">{trust.overline}</Overline>
            <SplitHeading as="h2" id="trust-title" className="text-h2 max-w-[14ch]">
              {trust.title}
            </SplitHeading>
            <p className="mt-5 text-[15.5px] leading-relaxed text-slate">
              <Verify note={trust.bodyVerify}>{trust.body}</Verify>
            </p>
            <div className="mt-auto pt-8">
              <p className="mb-3 border-t border-stone pt-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">Licensed by</p>
              <ul className="grid grid-cols-2 gap-3">
                {trust.licensedBy.map((l) => (
                  <li key={l.name} className="flex items-center gap-3 rounded-xl border border-stone bg-paper px-4 py-3">
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-white">
                      <Image src={l.logo} alt={`${l.name} logo`} fill sizes="36px" className="object-contain p-0.5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-display text-[15px] font-semibold leading-none">{l.name}</span>
                      <span className="mt-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.1em] text-slate">{l.sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Client logos */}
        <Reveal y={16} className="mt-16 md:mt-20">
          <p className="mb-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">
            <Verify note={trust.logosVerify}>{trust.logosLabel}</Verify>
          </p>
          <div className="relative border-y border-stone py-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent md:w-28" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent md:w-28" />
            <Marquee speed={36} ariaLabel="Clients and partners">
              {trust.logos.map((logo) => (
                <span key={logo.name} className="relative block h-9 w-28 shrink-0 opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-10 md:w-32" title={logo.name}>
                  <Image src={logo.src} alt={logo.name} fill sizes="128px" className="object-contain mix-blend-multiply" />
                </span>
              ))}
            </Marquee>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
