import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Tag } from "@/components/ui/Tag";
import { Verify } from "@/components/ui/Verify";
import type { Venture } from "@/content/company";
import { cn } from "@/lib/utils";

/**
 * Group venture card: image (clip reveal + parallax) beside kicker, status pill, name, description
 * and a small facts row. `dark` for Ink sections. Unconfirmed statuses are wrapped in <Verify>.
 */
export function VentureCard({ v, dark }: { v: Venture; dark?: boolean }) {
  const pill = (
    <Tag variant={v.status.tone} tone={dark ? "dark" : "light"} className={cn(v.status.tone === "neutral" && (dark ? "border-mango/50 text-mango" : "border-mango-deep/60 text-mango-text"))}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", v.status.tone === "good" ? "status-dot bg-signal-green" : "bg-mango")} />
      {v.status.label}
    </Tag>
  );
  return (
    <article id={v.id} className={cn("group grid overflow-hidden rounded-3xl border md:grid-cols-12", dark ? "border-white/10 bg-graphite text-paper" : "border-stone bg-white text-ink")}>
      <ParallaxImage src={v.image} alt={v.alt} speed={0.1} className="aspect-[16/10] w-full md:col-span-5 md:aspect-auto md:min-h-[300px]" sizes="(min-width: 768px) 42vw, 100vw" imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
      <div className="flex flex-col p-6 md:col-span-7 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={cn("font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]", dark ? "text-mango" : "text-mango-text")}>{v.kicker}</p>
          {v.status.verify ? <Verify note={v.status.verify}>{pill}</Verify> : pill}
        </div>
        <h3 className="mt-4 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.75rem]">{v.name}</h3>
        {v.short && <p className={cn("mt-1 text-[13.5px] font-medium", dark ? "text-mist" : "text-slate")}>{v.short}</p>}
        <p className={cn("mt-4 max-w-[58ch] text-[15px] leading-relaxed", dark ? "text-mist" : "text-slate")}>{v.bodyVerify ? <Verify note={v.bodyVerify}>{v.body}</Verify> : v.body}</p>
        <dl className={cn("mt-auto flex flex-wrap gap-x-10 gap-y-3 border-t pt-5", dark ? "border-white/10" : "border-stone")}>
          {v.facts.map((f) => (
            <div key={f.k} className="pt-3">
              <dt className={cn("font-mono text-[9.5px] font-medium uppercase tracking-[0.12em]", dark ? "text-mist" : "text-slate")}>{f.k}</dt>
              <dd className="mt-1 text-[14px] font-semibold">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
