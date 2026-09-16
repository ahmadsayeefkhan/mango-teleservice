"use client";

/**
 * Intro gate: reveals that would play on first paint wait until the preloader has wiped away
 * (so the hero sequence is seen, not hidden behind the overlay). When there is no preloader the
 * callback runs on the next frame. A 3.2s safety timer flushes the queue even if the preloader
 * fails, so content can never stay hidden.
 */

type Cb = () => void;

let done = false;
let queue: Cb[] = [];
let safety: ReturnType<typeof setTimeout> | null = null;

function preloaderActive() {
  return typeof document !== "undefined" && document.documentElement.hasAttribute("data-preload");
}

/** Called by Preloader when its exit wipe completes. Flushes queued reveals. */
export function markIntroDone() {
  if (done) return;
  done = true;
  if (safety) clearTimeout(safety);
  const cbs = queue;
  queue = [];
  cbs.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error(e);
    }
  });
}

/** True once the intro has finished (or was never needed). */
export function introDone() {
  return done || !preloaderActive();
}

/**
 * Run `cb` once the intro is ready. Returns a cancel function (call it on unmount).
 */
export function onIntroReady(cb: Cb): () => void {
  if (done || !preloaderActive()) {
    // Next macrotask (not rAF: rAF is paused in background tabs and would leave content hidden).
    let cancelled = false;
    const t = setTimeout(() => {
      if (!cancelled) cb();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }
  queue.push(cb);
  if (!safety) safety = setTimeout(markIntroDone, 3200);
  return () => {
    queue = queue.filter((c) => c !== cb);
  };
}
