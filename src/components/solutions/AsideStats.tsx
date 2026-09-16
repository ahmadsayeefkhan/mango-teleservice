import { Button } from "@/components/ui/Button";
import { Verify } from "@/components/ui/Verify";
import { SpecPanel } from "./SpecPanel";
import type { Link, SpecRow } from "@/content/solutions";

export type AsideStatsProps = {
  title: string;
  headline: string;
  rows: SpecRow[];
  cta: Link;
  verify?: string;
};

/** Hero aside "at a glance" card: mono title, Sora headline, spec rows, full-width CTA. */
export function AsideStats({ title, headline, rows, cta, verify }: AsideStatsProps) {
  return (
    <SpecPanel
      variant="bare"
      title={title}
      rows={rows}
      headline={verify ? <Verify note={verify}>{headline}</Verify> : headline}
      footer={
        <Button href={cta.href} variant="primary" tone="dark" className="w-full" magnetic>
          {cta.label}
        </Button>
      }
    />
  );
}
