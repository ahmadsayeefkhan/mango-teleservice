import { StatusPill } from "@/components/sections/StatusPill";
import { Verify } from "@/components/ui/Verify";

const SYSTEMS = ["International gateway (IIG)", "ITC circuits", "Data centre", "Mango Cloud", "Mango CA services"] as const;

/**
 * Support hero aside: service status card. Every row reads OPERATIONAL until the Phase 3 live
 * status page feeds it; the "updated" stamp is a placeholder ([timestamp] in the content doc).
 */
export function SupportStatusCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-graphite p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2.5 font-display text-[1.0625rem] font-semibold text-paper">
          <span className="relative inline-flex size-2.5">
            <span className="status-dot absolute inset-0 rounded-full bg-signal-green" />
            <span className="relative inline-flex size-2.5 rounded-full bg-signal-green" />
          </span>
          All systems operational
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-mist">
          <Verify note="timestamp; Phase 3 live status">Updated [timestamp] BST</Verify>
        </span>
      </div>
      <ul className="mt-5 divide-y divide-white/10 border-t border-white/10" aria-label="Service status">
        {SYSTEMS.map((s) => (
          <li key={s} className="flex items-center justify-between gap-4 py-3">
            <span className="text-[14px] text-paper/85">{s}</span>
            <StatusPill label="Operational" status="operational" tone="dark" variant="bare" className="text-signal-green" />
          </li>
        ))}
      </ul>
      <p className="mt-5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-mist">
        <Verify note="Phase 3: live status page">[Phase 3: live status page]</Verify>
      </p>
    </div>
  );
}
