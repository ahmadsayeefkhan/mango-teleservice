import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Industry } from "@/content/industries";

/**
 * Industries hub grid: six sector cards, the first inverted (Ink + Mango icon).
 * Hover: card lifts, icon tile turns Mango, arrow drifts, a Signal sweep draws along the bottom edge.
 * Enter: staggered rise (Reveal stagger).
 */
export function IndustryCards({ items }: { items: Industry[] }) {
  return (
    <Reveal stagger={0.07} as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5" aria-label="Industries">
      {items.map((ind, i) => {
        const featured = i === 0;
        return (
          <li key={ind.slug} className="flex">
            <Link
              href={`/industries/${ind.slug}`}
              data-tone={featured ? "ink" : "paper"}
              className={cn(
                "group relative flex min-h-[220px] w-full flex-col overflow-hidden rounded-2xl border p-6 transition-[transform,border-color,background-color] duration-300 ease-out-expo md:min-h-[240px] md:p-7",
                "motion-safe:hover:-translate-y-1",
                featured ? "border-white/10 bg-ink text-paper hover:border-mango/40" : "border-stone bg-white text-ink hover:border-ink/60",
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-xl border transition-colors duration-300",
                    featured ? "border-mango bg-mango text-ink" : "border-stone bg-paper text-ink group-hover:border-mango group-hover:bg-mango",
                  )}
                >
                  <Icon icon={ind.icon} size={20} />
                </span>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={cn(
                    "transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                    featured ? "text-mango" : "text-ink/60 group-hover:text-ink",
                  )}
                />
              </div>
              <div className="mt-auto pt-10">
                <h2 className="font-display text-[1.25rem] font-semibold leading-tight tracking-[-0.015em] md:text-[1.375rem]">{ind.name}</h2>
                <p className={cn("mt-2 text-[14.5px] leading-relaxed", featured ? "text-mist" : "text-slate")}>{ind.card.line}</p>
                <p className={cn("mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.14em]", featured ? "text-mango" : "text-mango-text")}>
                  {ind.card.tags.map((t, j) => (
                    <span key={t}>
                      {j > 0 && <span className={cn("mx-1.5", featured ? "text-mist/60" : "text-stone")}>·</span>}
                      {t}
                    </span>
                  ))}
                </p>
              </div>
              {/* Signal sweep */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-mango transition-transform duration-500 ease-out-expo group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </Link>
          </li>
        );
      })}
    </Reveal>
  );
}
