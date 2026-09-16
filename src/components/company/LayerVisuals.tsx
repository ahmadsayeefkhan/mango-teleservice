"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP, loadMotionPath } from "@/components/motion/gsap";
import { onVisible } from "@/components/motion/lite";
import { isStatic } from "@/components/motion/mode";
import type { NetworkLayer } from "@/content/company";
import { cn } from "@/lib/utils";

type Kind = NetworkLayer["key"];

/**
 * Brand diagrams for the four network layers (Ink surface, 1.5px Mist lines, Mango active paths).
 * Signals (`[data-sig]`) travel along the path named in `data-along` (MotionPath, looping);
 * static mode parks them mid-path.
 *
 * The loops are built only when the diagram first scrolls into view (MotionPath is loaded on
 * demand at that point) and pause while off-screen — the Network page renders eight of these
 * (four inline for mobile, four in the desktop panel), and animating SVG attributes on all of
 * them every frame was the single biggest main-thread cost on phones.
 */
export function LayerVisual({ kind, className }: { kind: Kind; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const s = svg.current;
      if (!s) return;
      const sigs = Array.from(s.querySelectorAll<SVGCircleElement>("[data-sig]"));
      const pathFor = (d: SVGCircleElement) => s.querySelector<SVGPathElement>(`#${uid}-${d.dataset.along}`);
      if (isStatic()) {
        sigs.forEach((d, i) => {
          const p = pathFor(d);
          if (!p) return;
          const pt = p.getPointAtLength(p.getTotalLength() * (0.35 + (i % 3) * 0.2));
          gsap.set(d, { attr: { cx: pt.x, cy: pt.y }, opacity: 1 });
        });
        return;
      }
      let visible = false;
      let disposed = false;
      const loops: gsap.core.Timeline[] = [];
      const build = contextSafe!(() => {
        sigs.forEach((d, i) => {
          const p = pathFor(d);
          if (!p) return;
          const dur = Number(d.dataset.dur ?? 2.8);
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: (i * 0.55) % 2.2, paused: !visible });
          tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" }, 0)
            .to(d, { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] }, duration: dur, ease: "power1.inOut" }, 0)
            .to(d, { opacity: 0, duration: 0.3, ease: "none" }, dur - 0.3);
          loops.push(tl);
        });
      });
      let requested = false;
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
    { scope: svg, dependencies: [kind] },
  );

  const id = (k: string) => `${uid}-${k}`;

  return (
    <svg ref={svg} viewBox="0 0 640 400" className={cn("block h-auto w-full", className)} aria-hidden="true" focusable="false">
      {kind === "subsea" && <Subsea id={id} />}
      {kind === "terrestrial" && <Terrestrial id={id} />}
      {kind === "interconnects" && <Interconnects id={id} />}
      {kind === "operations" && <Operations id={id} />}
    </svg>
  );
}

type IdFn = (k: string) => string;

const LINE = "stroke-mist/45";
const ACTIVE = "stroke-mango";

function Node({ x, y, w = 132, h = 44, label, sub, active }: { x: number; y: number; w?: number; h?: number; label: string; sub?: string; active?: boolean }) {
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect width={w} height={h} rx={8} className={cn(active ? "fill-mango" : "fill-ink", active ? "stroke-mango" : "stroke-white/15")} strokeWidth={1} />
      <text x={w / 2} y={sub ? h / 2 - 3 : h / 2 + 1} textAnchor="middle" dominantBaseline="middle" className={cn("font-display text-[12.5px] font-semibold", active ? "fill-ink" : "fill-paper")}>
        {label}
      </text>
      {sub && (
        <text x={w / 2} y={h / 2 + 12} textAnchor="middle" dominantBaseline="middle" className={cn("font-mono text-[8px] font-medium uppercase tracking-[0.12em]", active ? "fill-ink/70" : "fill-mist")}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Label({ x, y, children, anchor = "start", className }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; className?: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={cn("fill-mist font-mono text-[9px] font-medium uppercase tracking-[0.14em]", className)}>
      {children}
    </text>
  );
}

function Sig({ along, dur }: { along: string; dur?: number }) {
  return <circle data-sig data-along={along} data-dur={dur} r={3.5} fill="#FECA26" opacity={0} style={{ filter: "drop-shadow(0 0 4px rgba(254,202,38,.8))" }} />;
}

/* 01 — Subsea: Dhaka core → landing station → two submarine systems */
function Subsea({ id }: { id: IdFn }) {
  return (
    <g>
      <Label x={40} y={44}>Submarine cable systems</Label>
      {/* sea */}
      {[300, 322, 344, 366].map((y, i) => (
        <path key={y} d={`M40,${y} C140,${y - 6} 220,${y + 6} 320,${y} S500,${y - 6} 600,${y}`} fill="none" className="stroke-mist/20" strokeWidth={1} strokeDasharray={i % 2 ? "2 6" : "4 8"} />
      ))}
      <Label x={40} y={390} className="fill-mist/70">Bay of Bengal</Label>
      {/* routes */}
      <path id={id("core")} d="M140,190 H198" fill="none" className={LINE} strokeWidth={1.5} />
      <path id={id("smw4")} d="M330,190 C400,190 420,110 480,110 H520" fill="none" className={ACTIVE} strokeWidth={1.5} strokeOpacity={0.9} />
      <path id={id("smw5")} d="M330,190 C400,190 420,270 480,270 H520" fill="none" className={ACTIVE} strokeWidth={1.5} strokeOpacity={0.9} />
      <Node x={90} y={190} w={112} label="Dhaka core" sub="IIG · since 2008" />
      <Node x={264} y={190} w={132} label="Landing station" sub="Bangladesh" />
      <Node x={572} y={110} w={112} label="SEA-ME-WE 4" sub="Rights of use · 2009" active />
      <Node x={572} y={270} w={112} label="SEA-ME-WE 5" sub="Rights of use" active />
      <Sig along="core" dur={1.4} />
      <Sig along="smw4" />
      <Sig along="smw5" />
      <Sig along="smw4" dur={3.4} />
    </g>
  );
}

/* 02 — Terrestrial: Dhaka core → cross-border land routes → upstream carriers */
function Terrestrial({ id }: { id: IdFn }) {
  return (
    <g>
      <Label x={40} y={44}>International terrestrial cable · ITC 2012</Label>
      {/* land grid */}
      {[80, 140, 200, 260, 320].map((y) => (
        <line key={y} x1={40} x2={600} y1={y} y2={y} className="stroke-mist/12" strokeWidth={1} />
      ))}
      {[120, 220, 320, 420, 520].map((x) => (
        <line key={x} x1={x} x2={x} y1={60} y2={340} className="stroke-mist/12" strokeWidth={1} />
      ))}
      {/* border */}
      <line x1={400} x2={400} y1={60} y2={340} className="stroke-mango/60" strokeWidth={1.5} strokeDasharray="6 6" />
      <Label x={408} y={72} className="fill-mango">Border</Label>
      <Label x={392} y={72} anchor="end">Bangladesh</Label>
      <path id={id("a")} d="M148,200 H210 V120 H320 H470 V160 H500" fill="none" className={ACTIVE} strokeWidth={1.5} strokeOpacity={0.9} />
      <path id={id("b")} d="M148,200 H210 V280 H320 H470 V240 H500" fill="none" className={ACTIVE} strokeWidth={1.5} strokeOpacity={0.9} />
      <Node x={92} y={200} w={112} label="Dhaka core" sub="IIG + ITC" />
      <Node x={320} y={120} w={124} h={36} label="Land route A" />
      <Node x={320} y={280} w={124} h={36} label="Land route B" />
      <Node x={556} y={200} w={112} label="Upstream" sub="Carrier partners" active />
      <Label x={320} y={365} anchor="middle" className="fill-mist/70">Border points to be confirmed</Label>
      <Sig along="a" />
      <Sig along="b" dur={3.2} />
      <Sig along="a" dur={3.6} />
    </g>
  );
}

/* 03 — Interconnects: hub + seven content/exchange networks */
function Interconnects({ id }: { id: IdFn }) {
  const nets = ["Google", "Meta", "Amazon", "Akamai", "Equinix", "DE-CIX", "Zenlayer"];
  const cx = 320;
  const cy = 205;
  const r = 138;
  return (
    <g>
      <Label x={40} y={44}>Direct interconnection · content closer to users</Label>
      <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-mist/15" strokeWidth={1} strokeDasharray="3 7" />
      <circle cx={cx} cy={cy} r={64} fill="rgba(254,202,38,0.06)" />
      {nets.map((n, i) => {
        const a = -Math.PI / 2 + (i / nets.length) * Math.PI * 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <g key={n}>
            <path id={id(`s${i}`)} d={`M${x.toFixed(1)},${y.toFixed(1)} L${cx},${cy}`} fill="none" className={LINE} strokeWidth={1.5} />
            <Node x={x} y={y} w={92} h={32} label={n} />
            <Sig along={`s${i}`} dur={1.6 + (i % 3) * 0.4} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={34} className="fill-mango" />
      <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" className="fill-ink font-display text-[11px] font-bold">
        MANGO
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="middle" className="fill-ink/70 font-mono text-[7.5px] font-medium uppercase tracking-[0.12em]">
        core
      </text>
    </g>
  );
}

/* 04 — Operations: traffic trace + system status */
function Operations({ id }: { id: IdFn }) {
  const rows = [
    ["SEA-ME-WE 4", "UP"],
    ["SEA-ME-WE 5", "UP"],
    ["ITC ROUTES", "UP"],
    ["DATA CENTRE", "UP"],
  ];
  return (
    <g>
      <Label x={40} y={44}>Network operations · 24/7 · 365</Label>
      <text x={40} y={96} className="fill-mango font-display text-[40px] font-semibold tracking-[-0.02em]">
        24/7
      </text>
      <Label x={40} y={116} className="fill-mist/80">Monitoring · network and data centre</Label>
      {/* chart */}
      <rect x={40} y={150} width={330} height={200} rx={12} className="fill-ink stroke-white/10" strokeWidth={1} />
      {[190, 230, 270, 310].map((y) => (
        <line key={y} x1={56} x2={354} y1={y} y2={y} className="stroke-mist/12" strokeWidth={1} />
      ))}
      <path
        id={id("trace")}
        d="M56,300 L80,292 L104,296 L128,270 L152,276 L176,250 L200,258 L224,232 L248,240 L272,214 L296,224 L320,198 L354,206"
        fill="none"
        className={ACTIVE}
        strokeWidth={1.5}
      />
      <path d="M56,300 L80,292 L104,296 L128,270 L152,276 L176,250 L200,258 L224,232 L248,240 L272,214 L296,224 L320,198 L354,206 V336 H56 Z" fill="rgba(254,202,38,0.08)" />
      <Label x={56} y={172}>Traffic · Dhaka core</Label>
      <Sig along="trace" dur={3.2} />
      {/* status */}
      <rect x={394} y={150} width={206} height={200} rx={12} className="fill-ink stroke-white/10" strokeWidth={1} />
      <Label x={410} y={172}>System status</Label>
      {rows.map(([k, v], i) => (
        <g key={k} transform={`translate(410, ${196 + i * 36})`}>
          <line x1={0} x2={174} y1={20} y2={20} className="stroke-white/10" strokeWidth={1} />
          <text y={4} className="fill-paper font-mono text-[9.5px] font-medium uppercase tracking-[0.12em]">
            {k}
          </text>
          <circle cx={150} cy={1} r={3} className="fill-signal-green" />
          <text x={174} y={4} textAnchor="end" className="fill-signal-green font-mono text-[9px] font-medium tracking-[0.12em]">
            {v}
          </text>
        </g>
      ))}
    </g>
  );
}
