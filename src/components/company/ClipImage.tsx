"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, EASE, onceTrigger } from "@/components/motion/gsap";
import { onIntroReady } from "@/components/motion/intro";
import { liteReveal, onNear } from "@/components/motion/lite";
import { isLite, isStatic, takeOver } from "@/components/motion/mode";
import { cn } from "@/lib/utils";

export type ClipImageProps = {
  src: string;
  alt: string;
  /** Wrapper classes — must size the box (aspect-* or height). */
  className?: string;
  imgClassName?: string;
  sizes?: string;
  /** Wipe direction. */
  from?: "left" | "bottom";
  delay?: number;
};

/**
 * Portrait / photo reveal: clip-path wipe (left or bottom) with a settle from scale 1.12 → 1.
 * Static mode renders the image plainly. (Complements ParallaxImage, which reveals from the top.)
 * Lite tier: the same wipe as a CSS transition (no scale settle, no ScrollTrigger).
 */
export function ClipImage({ src, alt, className, imgClassName, sizes = "(min-width: 1024px) 33vw, 100vw", from = "left", delay = 0 }: ClipImageProps) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = box.current;
      const img = inner.current;
      if (!el || !img) return;
      if (isStatic()) {
        takeOver(el);
        return;
      }
      if (isLite()) {
        takeOver(el);
        return liteReveal(el, [el], { clip: from, delay });
      }
      const closed = from === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";
      gsap.set(el, { clipPath: closed, opacity: 1, willChange: "clip-path" });
      gsap.set(img, { scale: 1.12, transformOrigin: from === "left" ? "0% 50%" : "50% 100%" });
      takeOver(el);
      const play = contextSafe!(() => {
        const st = onceTrigger(el, "top 82%");
        gsap.to(el, { clipPath: "inset(0 0% 0 0)", duration: 1.4, delay, ease: EASE.expo, clearProps: "willChange,clipPath", scrollTrigger: st });
        gsap.to(img, { scale: 1, duration: 1.8, delay, ease: EASE.expo, scrollTrigger: onceTrigger(el, "top 82%") });
      });
      let cancelNear: (() => void) | null = null;
      const cancel = onIntroReady(() => {
        cancelNear = onNear(el, play);
      });
      return () => {
        cancel();
        cancelNear?.();
      };
    },
    { scope: box, dependencies: [] },
  );

  return (
    <div ref={box} className={cn("js-hide relative overflow-hidden bg-stone", className)}>
      <div ref={inner} className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", imgClassName)} />
      </div>
    </div>
  );
}
