"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, EASE, onceTrigger } from "./gsap";
import { isLite, isStatic, takeOver } from "./mode";
import { onIntroReady } from "./intro";
import { liteReveal, onNear } from "./lite";
import { cn } from "@/lib/utils";

export type ParallaxImageProps = {
  src: string;
  alt: string;
  /** Parallax strength 0–0.3 (fraction of height travelled while scrolling through the viewport). */
  speed?: number;
  /** Wrapper classes — MUST give the box a size (e.g. "aspect-[4/3]" or "h-[420px]"). */
  className?: string;
  imgClassName?: string;
  /** Above-the-fold image (preload + eager). */
  priority?: boolean;
  /** next/image sizes attribute. */
  sizes?: string;
  quality?: number;
};

/**
 * next/image (fill) inside an overflow-hidden box, revealed with a clip-path inset and moved with a
 * subtle scroll parallax. Static mode renders the image plainly. Lite tier: CSS clip reveal, no
 * scrubbed parallax (one fewer scroll-linked update per frame on phones).
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.15,
  className,
  imgClassName,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  quality,
}: ParallaxImageProps) {
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
        return liteReveal(el, [el], { clip: "top" });
      }
      const s = gsap.utils.clamp(0, 0.3, speed);
      gsap.set(el, { clipPath: "inset(0 0 100% 0)", opacity: 1, willChange: "clip-path" });
      gsap.set(img, { scale: 1 + s * 2 });
      takeOver(el);

      const play = contextSafe!(() => {
        gsap.to(el, {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.3,
          ease: EASE.expo,
          clearProps: "willChange,clipPath",
          scrollTrigger: onceTrigger(el, "top 85%"),
        });
        gsap.fromTo(
          img,
          { yPercent: -s * 100 },
          {
            yPercent: s * 100,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
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
    <div ref={box} className={cn("js-hide relative overflow-hidden bg-graphite", className)}>
      <div ref={inner} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : undefined}
          className={cn("object-cover", imgClassName)}
        />
      </div>
    </div>
  );
}
