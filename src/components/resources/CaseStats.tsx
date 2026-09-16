import { Counter } from "@/components/motion/Counter";
import { Verify } from "@/components/ui/Verify";
import { parseFigure } from "@/lib/utils";
import type { CaseStat } from "@/content/resources";

/** Case-study hero aside: large counted figures with labels. */
export function CaseStats({ stats, labels }: { stats: CaseStat[]; labels?: string[] }) {
  return (
    <dl className="divide-y divide-white/10">
      {stats.map((s, i) => {
        const fig = parseFigure(s.k);
        const label = labels?.[i] ?? s.v;
        const figure = fig ? <Counter to={fig.number} suffix={fig.suffix.toLowerCase() === " mo" ? " months" : fig.suffix} duration={1.4} /> : s.k;
        return (
          <div key={s.v} className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <dt className="sr-only">{label}</dt>
            <dd className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.02em] text-mango md:text-[2rem]">{s.verify ? <Verify note={s.verify}>{figure}</Verify> : figure}</dd>
            <dd className="text-right text-[13px] text-mist">{label}</dd>
          </div>
        );
      })}
    </dl>
  );
}
