"use client";

/**
 * Lite motion tier (touch devices / viewports < 1024px; <html data-lite>, stamped by the boot
 * script in mode.ts).
 *
 * On phones the expensive part of the motion system is not the animation itself but its setup:
 * SplitText measuring every heading, one ScrollTrigger per Reveal, and dozens of interleaved
 * layout reads/writes during hydration. This module replaces all of that with:
 *   - one shared IntersectionObserver (async, no forced layout), and
 *   - CSS transitions toggled by class (`.lt-rv` → `.lt-in`, `.lt-clip` → `.lt-in`; see globals.css).
 *
 * Elements that are already inside the first viewport when the observer first reports are left
 * exactly as the server rendered them (visible), so LCP content never waits for JS. Anything below
 * the fold is hidden and revealed as it scrolls in.
 */

type Handler = (entry: IntersectionObserverEntry) => void;

let revealObserver: IntersectionObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
const revealHandlers = new WeakMap<Element, Handler>();
const visibilityHandlers = new WeakMap<Element, Handler>();

function dispatch(map: WeakMap<Element, Handler>) {
  return (entries: IntersectionObserverEntry[]) => {
    for (const e of entries) map.get(e.target)?.(e);
  };
}

/** Observe `el` with the shared reveal observer until cancelled. First call reports the initial state. */
export function observe(el: Element, fn: Handler): () => void {
  if (!revealObserver) {
    // Reveal a little before the element reaches the bottom edge (≈ ScrollTrigger "top 96%").
    revealObserver = new IntersectionObserver(dispatch(revealHandlers), { rootMargin: "0px 0px -4% 0px" });
  }
  revealHandlers.set(el, fn);
  revealObserver.observe(el);
  return () => {
    revealHandlers.delete(el);
    revealObserver?.unobserve(el);
  };
}

/** Run `fn` once, the first time `el` intersects the viewport (immediately if it already does). */
export function onEnter(el: Element, fn: () => void): () => void {
  const cancel = observe(el, (e) => {
    if (e.isIntersecting) {
      cancel();
      fn();
    }
  });
  return cancel;
}

/**
 * Visibility tracking with a generous margin — used to pause looping decorations (signal dots,
 * marquee-style tweens) while they are off-screen, on every tier.
 */
export function onVisible(el: Element, fn: (visible: boolean) => void): () => void {
  if (!visibilityObserver) {
    visibilityObserver = new IntersectionObserver(dispatch(visibilityHandlers), { rootMargin: "160px 0px" });
  }
  visibilityHandlers.set(el, (e) => fn(e.isIntersecting));
  visibilityObserver.observe(el);
  return () => {
    visibilityHandlers.delete(el);
    visibilityObserver?.unobserve(el);
  };
}

let nearObserver: IntersectionObserver | null = null;
const nearHandlers = new WeakMap<Element, Handler>();

/**
 * Run `fn` once when `el` comes within ~1.5 viewports of the screen (immediately if it already is).
 * Used on the desktop tier to create ScrollTriggers / SplitText lazily instead of all at once when
 * the intro finishes: elements are already hidden inline at that point, so nothing is visible, and
 * the setup work (layout reads, DOM splitting) spreads across the scroll instead of one long task.
 */
export function onNear(el: Element, fn: () => void): () => void {
  if (!nearObserver) {
    nearObserver = new IntersectionObserver(dispatch(nearHandlers), { rootMargin: "150% 0px 150% 0px" });
  }
  const cancel = () => {
    nearHandlers.delete(el);
    nearObserver?.unobserve(el);
  };
  nearHandlers.set(el, (e) => {
    if (e.isIntersecting) {
      cancel();
      fn();
    }
  });
  nearObserver.observe(el);
  return cancel;
}

const CLIP = {
  top: "inset(0 0 100% 0)",
  bottom: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
} as const;

export type LiteRevealOptions = {
  /** Rise distance in px (default 28). */
  y?: number;
  /** Seconds. */
  delay?: number;
  /** Seconds between targets. */
  stagger?: number;
  /** Seconds (default 0.9). */
  duration?: number;
  /** Clip-path wipe instead of fade + rise ("top" = reveal downward from the top edge). */
  clip?: keyof typeof CLIP;
};

function finish(target: Element, prop: string) {
  const el = target as HTMLElement;
  const onEnd = (ev: TransitionEvent) => {
    if (ev.target !== el || ev.propertyName !== prop) return;
    el.removeEventListener("transitionend", onEnd);
    el.classList.remove("lt-rv", "lt-clip", "lt-in");
    el.style.removeProperty("--lt-y");
    el.style.removeProperty("--lt-delay");
    el.style.removeProperty("--lt-dur");
    el.style.removeProperty("--lt-clip");
  };
  el.addEventListener("transitionend", onEnd);
}

/**
 * CSS-transition reveal for the lite tier. `trigger` decides when; `targets` are what animates
 * (the trigger itself, or its children for a stagger). Returns a cancel function for unmount.
 */
export function liteReveal(trigger: Element, targets: Element[], o: LiteRevealOptions = {}): () => void {
  let armed = false;
  const cancel = observe(trigger, (e) => {
    if (!armed) {
      // First report. Anything at or above the first viewport stays as rendered (no flash, LCP safe).
      // An empty rect means the element sits in a `content-visibility: auto` section that has not
      // been rendered yet, i.e. it is well below the fold.
      const r = e.boundingClientRect;
      const unrendered = r.width === 0 && r.height === 0;
      if (!unrendered && r.top < window.innerHeight) {
        cancel();
        return;
      }
      armed = true;
      targets.forEach((t, i) => {
        const s = (t as HTMLElement).style;
        const d = (o.delay ?? 0) + i * (o.stagger ?? 0);
        if (d) s.setProperty("--lt-delay", `${d.toFixed(2)}s`);
        if (o.clip) {
          s.setProperty("--lt-clip", CLIP[o.clip]);
          t.classList.add("lt-clip");
          finish(t, "clip-path");
        } else {
          if (o.y !== undefined) s.setProperty("--lt-y", `${o.y}px`);
          if (o.duration) s.setProperty("--lt-dur", `${o.duration}s`);
          t.classList.add("lt-rv");
          finish(t, "opacity");
        }
      });
      return;
    }
    if (e.isIntersecting) {
      cancel();
      targets.forEach((t) => t.classList.add("lt-in"));
    }
  });
  return cancel;
}
