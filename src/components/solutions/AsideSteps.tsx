import { Button } from "@/components/ui/Button";
import { Verify } from "@/components/ui/Verify";
import type { Link } from "@/content/solutions";

export type AsideStepsProps = {
  title: string;
  steps: string[];
  cta: Link;
  verify?: string;
};

/** Hero aside for Digital Trust: the four certificate steps as a numbered mono list + external CTA. */
export function AsideSteps({ title, steps, cta, verify }: AsideStepsProps) {
  const external = /^https?:/.test(cta.href);
  return (
    <div>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">
        {verify ? <Verify note={verify}>{title}</Verify> : title}
      </p>
      <ol className="mt-4 divide-y divide-white/10">
        {steps.map((s, i) => (
          <li key={s} className="flex items-baseline justify-between gap-6 py-3.5">
            <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-mist">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-right font-mono text-[12.5px] font-medium tracking-[0.02em] text-paper">{s}</span>
          </li>
        ))}
      </ol>
      <Button href={cta.href} variant="primary" tone="dark" icon={external ? "external" : "arrow"} className="mt-5 w-full" magnetic>
        {cta.label}
      </Button>
    </div>
  );
}
