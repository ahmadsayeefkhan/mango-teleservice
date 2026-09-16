"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { scrollTo } from "@/components/motion/lenis-store";
import { Reveal } from "@/components/motion/Reveal";
import { group } from "@/content/company";
import { cn } from "@/lib/utils";

/** Group hero pills: smooth-scroll to each sector section; the pill of the section in view is highlighted. */
export function SectorTabs() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const triggers = group.sectors.map((s) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setActive(s.id);
          else setActive((cur) => (cur === s.id ? null : cur));
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <Reveal y={16} delay={0.4} className="mt-8">
      <nav aria-label="Sectors" className="flex flex-wrap gap-2">
        {group.sectors.map((s) => {
          const on = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={on ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(`#${s.id}`, -88);
                history.replaceState(null, "", `#${s.id}`);
              }}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-[13.5px] font-semibold leading-none transition-colors duration-200 ease-out-expo focus-visible:outline-mango",
                on ? "border-mango bg-mango text-ink" : "border-white/20 bg-white/[0.04] text-paper hover:border-paper/60 hover:bg-white/10",
              )}
            >
              {s.tab}
            </a>
          );
        })}
      </nav>
    </Reveal>
  );
}
