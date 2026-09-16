import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { network } from "@/content/company";

type Row = { k: string; v: string; verify?: string };

function Card({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div data-tone="ink" className="rounded-3xl border border-white/10 bg-ink p-6 text-paper md:p-8">
      <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango">{title}</p>
      <dl className="mt-4 divide-y divide-white/10">
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline justify-between gap-6 py-3.5">
            <dt className="text-[14px] text-mist">{r.k}</dt>
            <dd className="text-right font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-paper">{r.verify ? <Verify note={r.verify}>{r.v}</Verify> : r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Network §04 — peering & operations reference cards (facts pending verification are wrapped in <Verify>). */
export function OpsCards() {
  return (
    <Section tone="paper" id="operations" padding="tight" className="pb-6 md:pb-8">
      <Container>
        <Reveal stagger={0.1} className="grid gap-4 md:grid-cols-2">
          <Card title={network.ops.peering.title} rows={network.ops.peering.rows} />
          <Card title={network.ops.operations.title} rows={network.ops.operations.rows} />
        </Reveal>
      </Container>
    </Section>
  );
}
