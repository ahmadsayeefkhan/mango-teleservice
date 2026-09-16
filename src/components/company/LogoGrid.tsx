import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Overline } from "@/components/ui/Overline";
import { Verify } from "@/components/ui/Verify";
import type { LogoItem } from "@/content/company";
import { cn } from "@/lib/utils";

export type LogoGridProps = {
  id: string;
  overline: string;
  title: string;
  logos: LogoItem[];
  /** Permission / verification note shown as a mono caption. */
  verify?: string;
  className?: string;
};

/**
 * Partner / client logo grid: white tiles on Paper, grayscale → colour on hover, staggered reveal.
 * Tiles without a logo file render the name as a wordmark. Names sit under each logo (also the
 * accessible name).
 */
export function LogoGrid({ id, overline, title, logos, verify, className }: LogoGridProps) {
  const few = logos.length <= 3;
  return (
    <div id={id} className={cn("scroll-mt-28", className)}>
      <div className="mb-8 grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <Reveal y={16} className="mb-4">
            <Overline>{overline}</Overline>
          </Reveal>
          <SplitHeading as="h2" id={`${id}-title`} className="text-h2 max-w-[20ch] text-balance">
            {title}
          </SplitHeading>
        </div>
        {verify && (
          <Reveal y={12} delay={0.1} className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate lg:col-span-4 lg:pb-1.5 lg:text-right">
            <Verify note={verify}>Logo permission required</Verify>
          </Reveal>
        )}
      </div>
      <Reveal stagger={0.05} as="ul" className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4", few ? "lg:grid-cols-6" : "lg:grid-cols-6")} aria-labelledby={`${id}-title`}>
        {logos.map((l) => (
          <li key={l.name} className="group flex flex-col rounded-2xl border border-stone bg-white p-4 transition-colors duration-300 hover:border-ink/25">
            <span className="relative block h-16 w-full md:h-[72px]">
              {l.src ? (
                <Image src={l.src} alt="" fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" className="object-contain grayscale transition-all duration-300 ease-out-expo group-hover:grayscale-0" />
              ) : (
                <span className="flex h-full items-center justify-center text-center font-display text-[1.0625rem] font-bold tracking-[-0.02em] text-ink/70 transition-colors group-hover:text-ink">{l.name}</span>
              )}
            </span>
            <span className="mt-3 border-t border-stone pt-3 text-center text-[11.5px] font-medium leading-snug text-slate">
              {l.verify ? <Verify note={l.verify}>{l.name}</Verify> : l.name}
            </span>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
