import { Counter } from "@/components/motion/Counter";
import { Icon } from "@/components/ui/Icon";
import { Verify } from "@/components/ui/Verify";
import { parseFigure } from "@/lib/utils";
import type { Industry } from "@/content/industries";

/** Hero aside: Mango icon tile + three mono proof figures (leading integers count up). */
export function ProofCard({ industry }: { industry: Industry }) {
  return (
    <div>
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-mango text-ink">
        <Icon icon={industry.icon} size={22} />
      </span>
      <dl className="mt-6 divide-y divide-white/10 border-t border-white/10">
        {industry.proof.map((p) => {
          const fig = parseFigure(p.k);
          const numeric = fig && /^\d/.test(p.k) && fig.number >= 5;
          const figure = numeric ? <Counter to={fig.number} suffix={fig.suffix} duration={1.4} /> : p.k;
          return (
            <div key={p.k} className="py-4">
              <dt className="sr-only">{p.v}</dt>
              <dd className="font-mono text-[1.0625rem] font-medium uppercase tracking-[0.04em] text-mango md:text-[1.125rem]">
                {p.verify ? <Verify note={p.verify}>{figure}</Verify> : figure}
              </dd>
              <dd className="mt-1 text-[13.5px] leading-relaxed text-mist">{p.v}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
