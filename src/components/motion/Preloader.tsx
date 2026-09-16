"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";
import { markIntroDone } from "./intro";
import { lockScroll } from "./lenis-store";
import { pad } from "@/lib/utils";

/**
 * First visit per session (decided by the inline boot script via <html data-preload>):
 * mango mark + mono counter 000→100 + a Mango-yellow Signal Line wipe, ≤ 1.4s, skippable
 * (click / Enter / Escape / Space). The shell is server-rendered but display:none unless the
 * boot script enables it, and CSS auto-hides it after 2.8s if JS never runs.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-preload")) {
      // Shell stays display:none via CSS; nothing to animate.
      markIntroDone();
      return;
    }
    try {
      sessionStorage.setItem("mango:intro", "1");
    } catch {
      /* private mode */
    }
    const el = root.current!;
    // JS owns it now: cancel the CSS timeout fallback.
    el.style.animation = "none";

    // Idempotent release: always removes the overlay, unlocks scroll and flushes gated reveals.
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      html.removeAttribute("data-preload");
      lockScroll(false);
      setGone(true);
      markIntroDone();
    };

    const state = { n: 0 };
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: finish });
    // JS safety net: if the timeline hasn't completed in 2.2s (compile stall, throttled rAF, hidden tab),
    // jump to the end and release the page regardless.
    const safety = setTimeout(() => {
      tl.progress(1);
      finish();
    }, 2200);
    tl.fromTo(mark.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }, 0)
      .to(
        state,
        {
          n: 100,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter.current) counter.current.textContent = pad(state.n, 3);
          },
        },
        0.05,
      )
      .fromTo(rail.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0.05)
      .fromTo(wipe.current, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power3.inOut" }, 0.85)
      .to(el, { yPercent: -100, duration: 0.42, ease: "expo.inOut" }, 1.0);

    const skip = (e?: KeyboardEvent | MouseEvent) => {
      if (e instanceof KeyboardEvent && !["Enter", "Escape", " "].includes(e.key)) return;
      tl.progress(1);
    };
    el.addEventListener("click", skip);
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(safety);
      el.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="preloader" aria-hidden="true" data-lenis-prevent>
      <div ref={wipe} className="absolute inset-0 origin-bottom bg-mango" style={{ transform: "scaleY(0)" }} />
      <div className="relative flex w-[min(320px,80vw)] flex-col items-center gap-6">
        <div ref={mark} className="relative h-12 w-16">
          {/* Same intrinsic size as the header Logo so both resolve to one optimized URL (no extra request). */}
          <Image src="/brand/mango-mark.png" alt="" width={152} height={114} className="h-12 w-auto" loading="eager" />
        </div>
        <div className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-mist">
          <span>Establishing link</span>
          <span ref={counter} className="tabular-nums text-paper">
            000
          </span>
        </div>
        <span className="relative block h-0.5 w-full bg-white/10">
          <span ref={rail} className="absolute inset-0 origin-left bg-mango" style={{ transform: "scaleX(0)" }} />
        </span>
      </div>
    </div>
  );
}
