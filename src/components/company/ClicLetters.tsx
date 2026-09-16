"use client";

import { useRef } from "react";
import { gsap, useGSAP, onceTrigger } from "@/components/motion/gsap";
import { onIntroReady } from "@/components/motion/intro";
import { isStatic, takeOver } from "@/components/motion/mode";
import { about } from "@/content/company";

/**
 * CLIC philosophy: four graphite cards with a large Mango letter each. On enter (full motion)
 * the letters first rise one by one as a single centred word "CLIC" (positioned over the grid),
 * then each letter travels into its card while the card frames and copy fade in beneath it.
 * Static mode renders the finished cards.
 */
export function ClicLetters() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el) return;
      const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-clic-letter]"));
      const ghosts = Array.from(el.querySelectorAll<HTMLElement>("[data-clic-ghost]"));
      const frames = Array.from(el.querySelectorAll<HTMLElement>("[data-clic-frame]"));
      const texts = Array.from(el.querySelectorAll<HTMLElement>("[data-clic-text]"));
      const all = [...letters, ...frames, ...texts];
      if (isStatic() || letters.length !== ghosts.length) {
        all.forEach(takeOver);
        return;
      }
      // Park each letter over its ghost in the centred word (Flip by hand: keeps React's DOM intact).
      letters.forEach((l, i) => {
        const a = l.getBoundingClientRect();
        const g = ghosts[i].getBoundingClientRect();
        gsap.set(l, {
          x: g.left + g.width / 2 - (a.left + a.width / 2),
          y: g.top + g.height / 2 - (a.top + a.height / 2),
          scale: g.height / a.height,
          transformOrigin: "50% 50%",
          opacity: 0,
          yPercent: 60,
          willChange: "transform, opacity",
        });
      });
      gsap.set(frames, { opacity: 0, y: 24 });
      gsap.set(texts, { opacity: 0, y: 16 });
      all.forEach(takeOver);

      const play = contextSafe!(() => {
        const tl = gsap.timeline({ scrollTrigger: onceTrigger(el, "top 70%"), defaults: { ease: "expo.out" } });
        tl.to(letters, { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.16 })
          .to(letters, { x: 0, y: 0, scale: 1, duration: 1.2, stagger: 0.07, ease: "power3.inOut", clearProps: "willChange" }, "+=0.55")
          .to(frames, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" }, "-=0.75")
          .to(texts, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, "-=0.7");
      });
      const cancel = onIntroReady(play);
      return () => cancel();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div ref={root} className="relative">
      {/* Ghost word: invisible layout target for the intro (letters gather here first). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[0.04em] font-display text-[clamp(5.5rem,17vw,13rem)] font-bold leading-none text-mango opacity-0">
        {about.clic.letters.map((l, i) => (
          <span key={i} data-clic-ghost>
            {l.letter}
          </span>
        ))}
      </div>

      <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {about.clic.letters.map((l, i) => (
          <li key={i} className="relative min-h-[220px] p-6 md:p-7">
            <span data-clic-frame aria-hidden="true" className="js-hide absolute inset-0 rounded-2xl border border-white/10 bg-graphite" />
            <div className="relative">
              {/* inline-block so the transform origin is the glyph's centre, not the card's */}
              <span data-clic-letter aria-hidden="true" className="js-hide inline-block font-display text-[3.5rem] font-bold leading-none text-mango md:text-[4rem]">
                {l.letter}
              </span>
              <div data-clic-text className="js-hide">
                <h3 className="mt-5 font-display text-[1.125rem] font-semibold text-paper">
                  <span className="sr-only">{l.letter}: </span>
                  {l.word}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{l.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
