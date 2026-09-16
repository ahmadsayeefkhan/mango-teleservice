"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { legalNav } from "@/content/legal";
import { cn } from "@/lib/utils";

/** Legal side nav: tracks the document section in view (IntersectionObserver) and highlights it. */
export function LegalNav({ className }: { className?: string }) {
  const [active, setActive] = useState<string>("privacy");

  useEffect(() => {
    const ids = legalNav.filter((n) => !("external" in n && n.external)).map((n) => n.id);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) visible.set(en.target.id, en.boundingClientRect.top);
          else visible.delete(en.target.id);
        }
        if (visible.size) {
          const top = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActive(top);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Legal documents" className={className}>
      <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">Legal</p>
      <ul className="flex flex-col gap-1">
        {legalNav.map((n) => {
          const external = "external" in n && n.external;
          const on = !external && active === n.id;
          return (
            <li key={n.id}>
              <a
                href={n.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-[14px] transition-colors duration-200",
                  on ? "bg-ink font-medium text-paper" : "text-slate hover:bg-stone/60 hover:text-ink",
                )}
              >
                {n.label}
                {external && <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
