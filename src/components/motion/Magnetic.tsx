"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";
import { isStatic } from "./mode";
import { cn } from "@/lib/utils";

export type MagneticProps = {
  children: ReactNode;
  /** 0–1: how far the child follows the pointer (fraction of the pointer offset). */
  strength?: number;
  className?: string;
};

/**
 * Magnetic hover for primary CTAs: the child drifts toward a fine pointer and eases back.
 * No-op on touch devices and in static mode.
 */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || isStatic() || !window.matchMedia("(pointer: fine)").matches) return;
      const s = gsap.utils.clamp(0, 1, strength);
      const toX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const toY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        toX(dx * s);
        toY(dy * s);
      };
      const leave = () => {
        toX(0);
        toY(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <span ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
}
