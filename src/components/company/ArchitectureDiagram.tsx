"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, loadMotionPath } from "@/components/motion/gsap";
import { onVisible } from "@/components/motion/lite";
import { isStatic } from "@/components/motion/mode";
import { network } from "@/content/company";
import { cn } from "@/lib/utils";

type Path = { d: string; delay: number };

/**
 * Network-page architecture diagram: YOUR NETWORK → MANGO CORE → INTERNATIONAL PATHS → GLOBAL
 * NETWORKS. HTML nodes in a grid; an SVG overlay measures them and draws elbow connectors with
 * Mango signal dots travelling along them (MotionPath). Stacks vertically below lg (no connectors).
 * Pattern shared with the Home RouteDiagram; copied here so the company area owns its variant.
 */
export function ArchitectureDiagram() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        setPaths([]);
        return;
      }
      const box = el.getBoundingClientRect();
      const rel = (r: DOMRect) => ({ l: r.left - box.left, r: r.right - box.left, cy: r.top - box.top + r.height / 2 });
      const core = el.querySelector<HTMLElement>("[data-node=core]");
      if (!core) return;
      const c = rel(core.getBoundingClientRect());
      const next: Path[] = [];
      let k = 0;
      const elbow = (x1: number, y1: number, x2: number, y2: number) => {
        const mx = x1 + (x2 - x1) / 2;
        return `M${x1},${y1} H${mx} V${y2} H${x2}`;
      };
      el.querySelectorAll<HTMLElement>("[data-node=yours]").forEach((n) => {
        const r = rel(n.getBoundingClientRect());
        next.push({ d: elbow(r.r, r.cy, c.l, c.cy), delay: (k++ * 0.7) % 2.1 });
      });
      const pathEls = Array.from(el.querySelectorAll<HTMLElement>("[data-node=path]"));
      pathEls.forEach((n) => {
        const r = rel(n.getBoundingClientRect());
        next.push({ d: elbow(c.r, c.cy, r.l, r.cy), delay: (k++ * 0.7) % 2.1 });
      });
      el.querySelectorAll<HTMLElement>("[data-node=global]").forEach((n, i) => {
        const p = pathEls[Math.min(i, pathEls.length - 1)];
        if (!p) return;
        const pr = rel(p.getBoundingClientRect());
        const r = rel(n.getBoundingClientRect());
        next.push({ d: elbow(pr.r, pr.cy, r.l, r.cy), delay: (k++ * 0.7) % 2.1 });
      });
      setSize({ w: box.width, h: box.height });
      setPaths(next);
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  // Loops are built on first sight (MotionPath loads on demand) and paused while off-screen.
  useGSAP(
    (_, contextSafe) => {
      const s = svg.current;
      if (!s || !paths.length) return;
      const dots = s.querySelectorAll<SVGCircleElement>("[data-dot]");
      const lines = s.querySelectorAll<SVGPathElement>("[data-path]");
      if (isStatic()) {
        dots.forEach((d, i) => {
          const p = lines[i];
          if (!p) return;
          const pt = p.getPointAtLength(p.getTotalLength() * 0.55);
          gsap.set(d, { attr: { cx: pt.x, cy: pt.y }, opacity: 1 });
        });
        return;
      }
      let visible = false;
      let disposed = false;
      let requested = false;
      const loops: gsap.core.Timeline[] = [];
      const build = contextSafe!(() => {
        dots.forEach((d, i) => {
          const p = lines[i];
          if (!p) return;
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, delay: paths[i].delay, paused: !visible });
          tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "none" }, 0)
            .to(d, { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] }, duration: 2.6, ease: "power1.inOut" }, 0)
            .to(d, { opacity: 0, duration: 0.35, ease: "none" }, 2.25);
          loops.push(tl);
        });
      });
      const cancel = onVisible(s, (v) => {
        visible = v;
        if (v && !requested) {
          requested = true;
          loadMotionPath().then(() => {
            if (!disposed) build();
          });
          return;
        }
        loops.forEach((tl) => tl.paused(!v));
      });
      return () => {
        disposed = true;
        cancel();
      };
    },
    { scope: svg, dependencies: [paths] },
  );

  const col = network.architecture.columns;
  const node = (label: string, kind: string, extra?: string) => (
    <li key={label} data-node={kind} className={cn("flex items-center gap-2.5 rounded-lg border border-white/10 bg-ink/60 px-3.5 py-3 text-[13.5px] text-paper/90", extra)}>
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-mist" />
      {label}
    </li>
  );

  return (
    <div ref={root} className="relative rounded-3xl border border-white/10 bg-graphite/60 p-5 md:p-8">
      <svg ref={svg} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" width={size.w || undefined} height={size.h || undefined} viewBox={size.w ? `0 0 ${size.w} ${size.h}` : undefined}>
        {paths.map((p, i) => (
          <path key={`p${i}`} data-path d={p.d} className="route-path" />
        ))}
        {paths.map((_, i) => (
          <circle key={`d${i}`} data-dot r={3.5} fill="#FECA26" opacity={0} style={{ filter: "drop-shadow(0 0 4px rgba(254,202,38,.8))" }} />
        ))}
      </svg>

      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.15fr_1fr_1fr] lg:gap-10 xl:gap-14">
        <div className="order-1 lg:order-2 lg:flex lg:flex-col lg:justify-center">
          <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist lg:hidden">{col.core.title}</p>
          <div data-node="core" className="rounded-2xl bg-mango px-6 py-6 text-center text-ink">
            <p className="hidden font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink/70 lg:block">{col.core.title}</p>
            <p className="mt-1 font-display text-[1.75rem] font-bold tracking-[-0.02em] md:text-[2rem]">{col.core.big}</p>
            <p className="mt-1 text-[12.5px] font-medium text-ink/75">{col.core.sub}</p>
          </div>
        </div>
        <div className="order-2 lg:order-1">
          <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">{col.yours.title}</p>
          <ul className="flex flex-col gap-2.5">{col.yours.nodes.map((n) => node(n, "yours"))}</ul>
        </div>
        <div className="order-3">
          <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">{col.paths.title}</p>
          <ul className="flex flex-col gap-2.5">
            {col.paths.nodes.map((n) => (
              <li key={n} data-node="path" className="flex items-center gap-2.5 rounded-lg border border-mango/30 bg-ink/60 px-3.5 py-3 text-[13.5px] text-paper">
                <span aria-hidden="true" className="signal-dot size-1.5 shrink-0 rounded-full bg-mango" />
                {n}
              </li>
            ))}
          </ul>
        </div>
        <div className="order-4">
          <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">{col.global.title}</p>
          <ul className="flex flex-col gap-2.5">{col.global.nodes.map((n) => node(n, "global"))}</ul>
        </div>
      </div>
    </div>
  );
}
