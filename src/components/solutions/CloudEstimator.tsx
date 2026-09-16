"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Button } from "@/components/ui/Button";
import { Verify } from "@/components/ui/Verify";
import { cn } from "@/lib/utils";

export type CloudEstimatorProps = {
  title: string;
  submit: string;
  note: string;
  verify: string;
};

/*
 * Placeholder rate card (BDT / month). Every figure is [VERIFY: price table]; the UI marks the
 * result with <Verify> and the note says the cloud team confirms pricing.
 */
const RATES = {
  base: 400,
  vcpu: 650,
  ramGb: 280,
  ssdGb: 14,
  sasGb: 7,
  bandwidthMbps: 9,
};
const BANDWIDTH = [10, 20, 50, 100, 200, 500];

const fmt = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });

function estimate(v: number, r: number, s: number, ssd: boolean, b: number) {
  return Math.round((RATES.base + v * RATES.vcpu + r * RATES.ramGb + s * (ssd ? RATES.ssdGb : RATES.sasGb) + b * RATES.bandwidthMbps) / 10) * 10;
}

/**
 * Interactive cloud cost estimator (hero aside on /solutions/cloud). Real range inputs + selects,
 * a live price that tweens between values with GSAP, and a GET submit that carries the chosen
 * configuration to `/contact?intent=quote&service=cloud&…`.
 */
export function CloudEstimator({ title, submit, note, verify }: CloudEstimatorProps) {
  const id = useId();
  const [vcpu, setVcpu] = useState(4);
  const [ram, setRam] = useState(8);
  const [storage, setStorage] = useState(200);
  const [disk, setDisk] = useState<"SSD" | "SAS">("SSD");
  const [bandwidth, setBandwidth] = useState(50);

  const price = useMemo(() => estimate(vcpu, ram, storage, disk === "SSD", bandwidth), [vcpu, ram, storage, disk, bandwidth]);

  const priceEl = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: price });
  const tween = useRef<gsap.core.Tween | null>(null);

  // Tween the displayed number toward the new price (static mode: snap).
  useEffect(() => {
    const el = priceEl.current;
    if (!el) return;
    tween.current?.kill();
    if (isStatic()) {
      shown.current.v = price;
      el.textContent = fmt.format(price);
      return;
    }
    tween.current = gsap.to(shown.current, {
      v: price,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = fmt.format(Math.round(shown.current.v));
      },
    });
    return () => {
      tween.current?.kill();
    };
  }, [price]);

  // Subtle "signal" flash on the price on change (full motion only).
  const flash = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      if (isStatic() || !flash.current) return;
      gsap.fromTo(flash.current, { opacity: 0.9, scaleX: 0 }, { opacity: 0, scaleX: 1, duration: 0.7, ease: "power2.out", transformOrigin: "left center" });
    },
    { dependencies: [price] },
  );

  // id="pricing": deep-link target used by Industries pages (/solutions/cloud#pricing) and this page's own CTAs.
  return (
    <form action="/contact" method="get" id="pricing" className="flex flex-col scroll-mt-32" aria-labelledby={`${id}-title`}>
      <p id={`${id}-title`} className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">
        {title}
      </p>
      <input type="hidden" name="intent" value="quote" />
      <input type="hidden" name="service" value="cloud" />

      <div className="mt-5 flex flex-col gap-4">
        <Range id={`${id}-vcpu`} name="vcpu" label="vCPU" min={1} max={32} step={1} value={vcpu} onChange={setVcpu} display={`${vcpu} ${vcpu === 1 ? "core" : "cores"}`} />
        <Range id={`${id}-ram`} name="ram" label="Memory" min={1} max={128} step={1} value={ram} onChange={setRam} display={`${ram} GB RAM`} />
        <div className="grid grid-cols-[1fr_auto] items-end gap-3">
          <Range id={`${id}-storage`} name="storage" label="Storage" min={20} max={2000} step={20} value={storage} onChange={setStorage} display={`${fmt.format(storage)} GB`} />
          <fieldset className="flex h-11 items-center rounded-lg border border-white/12 p-0.5">
            <legend className="sr-only">Disk type</legend>
            {(["SSD", "SAS"] as const).map((d) => (
              <label
                key={d}
                className={cn(
                  "flex h-full cursor-pointer items-center rounded-md px-3 font-mono text-[11px] font-medium tracking-[0.08em] transition-colors",
                  disk === d ? "bg-mango text-ink" : "text-mist hover:text-paper",
                )}
              >
                <input type="radio" name="disk" value={d} checked={disk === d} onChange={() => setDisk(d)} className="sr-only" />
                {d}
              </label>
            ))}
          </fieldset>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-bandwidth`} className="text-[12px] font-medium text-mist">
            Bandwidth
          </label>
          <span className="relative block">
            <select
              id={`${id}-bandwidth`}
              name="bandwidth"
              value={bandwidth}
              onChange={(e) => setBandwidth(Number(e.target.value))}
              className="h-11 w-full appearance-none rounded-lg border border-white/12 bg-ink px-3.5 pr-10 text-[14px] text-paper transition-colors hover:border-white/25 focus-visible:border-mango"
            >
              {BANDWIDTH.map((b) => (
                <option key={b} value={b}>
                  {b} Mbps
                </option>
              ))}
            </select>
            <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mist" />
          </span>
        </div>
      </div>

      {/* Live price */}
      <div className="relative mt-6 overflow-hidden rounded-xl border border-white/10 bg-ink/60 px-4 py-4">
        <span ref={flash} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-mango opacity-0" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-mist">Estimated monthly</p>
            <p className="mt-1 font-display text-[1.75rem] font-semibold leading-none tracking-[-0.02em] text-paper" aria-live="polite" aria-atomic="true">
              <Verify note={verify}>
                <span className="mr-1 text-[1.125rem] text-mango">৳</span>
                <span ref={priceEl} className="tabular-nums">
                  {fmt.format(price)}
                </span>
              </Verify>
            </p>
          </div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-mist">
            {vcpu} vCPU · {ram} GB · {storage} GB {disk}
          </p>
        </div>
        <p className="mt-3 text-[11.5px] leading-snug text-mist">{note}</p>
      </div>

      <Button type="submit" variant="primary" tone="dark" className="mt-5 w-full" magnetic>
        {submit}
      </Button>
    </form>
  );
}

function Range({
  id,
  name,
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  display: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[12px] font-medium text-mist">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[12px] font-medium tracking-[0.02em] text-paper tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("sol-range", "h-2 w-full cursor-pointer appearance-none rounded-full")}
        style={{ background: `linear-gradient(to right, #feca26 ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
      />
    </div>
  );
}
