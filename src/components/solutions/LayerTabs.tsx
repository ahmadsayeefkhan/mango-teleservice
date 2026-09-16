"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { scrollTo } from "@/components/motion/lenis-store";
import { cn } from "@/lib/utils";
import type { HubLayer } from "@/content/solutions";

/**
 * Hub hero layer tabs ("01 Connect … 04 Manage & Build"). Plain anchor links (work without JS);
 * with JS they smooth-scroll via Lenis and the active pill follows the layer group in view.
 */
export function LayerTabs({ layers }: { layers: Pick<HubLayer, "code" | "num" | "label">[] }) {
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      // Active tab = the layer group crossing the 45% viewport line; none above the first group.
      const triggers: ScrollTrigger[] = [];
      const sync = () => {
        const on = triggers.find((t) => t.isActive);
        setActive(on ? String(on.vars.id) : null);
      };
      layers.forEach((l) =>
        triggers.push(
          ScrollTrigger.create({
            id: l.code,
            trigger: `#${l.code}`,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: sync,
            onRefresh: sync,
          }),
        ),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [] },
  );

  return (
    <nav aria-label="Solution layers" className="mt-10">
      <ul ref={root} className="flex flex-wrap gap-2">
        {layers.map((l, i) => {
          const on = active ? active === l.code : i === 0;
          return (
            <li key={l.code}>
              <a
                href={`#${l.code}`}
                aria-current={on ? "true" : undefined}
                onClick={(e) => {
                  const el = document.getElementById(l.code);
                  if (!el) return;
                  e.preventDefault();
                  scrollTo(el, -88);
                  history.replaceState(null, "", `#${l.code}`);
                }}
                className={cn(
                  "inline-flex h-10 items-center gap-2.5 rounded-full border px-4 text-[13.5px] font-semibold transition-[background-color,border-color,color] duration-300 ease-out-expo",
                  on ? "border-mango bg-mango text-ink" : "border-white/15 text-paper hover:border-white/40",
                )}
              >
                <span className={cn("font-mono text-[10px] font-medium tracking-[0.12em]", on ? "text-ink/70" : "text-mist")}>{l.num}</span>
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
