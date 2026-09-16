"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export type FAQItem = { q: string; a: ReactNode };

export type FAQProps = {
  items: FAQItem[];
  title?: string;
  overline?: string;
  intro?: ReactNode;
  /** Surface. */
  tone?: "light" | "dark";
  /** Render only the accordion (no header/section chrome). */
  bare?: boolean;
  /** Index open by default (-1 = all closed). */
  defaultOpen?: number;
  className?: string;
  id?: string;
};

/**
 * Accessible accordion (button + region, aria-expanded/controls, arrow-key navigation) with a
 * GSAP height animation. Static/reduced-motion: instant toggle.
 * `<FAQ items={[{ q, a }]} title="Questions we hear most." />`
 */
export function FAQ({
  items,
  title = "Questions we hear most.",
  overline = "FAQ",
  intro,
  tone = "light",
  bare = false,
  defaultOpen = 0,
  className,
  id,
}: FAQProps) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-faq]");
    if (!buttons?.length) return;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = (i + 1) % buttons.length;
    if (e.key === "ArrowUp") next = (i - 1 + buttons.length) % buttons.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = buttons.length - 1;
    if (next !== null) {
      e.preventDefault();
      buttons[next].focus();
    }
  };

  const accordion = (
    <div ref={listRef} className={cn("divide-y border-y", dark ? "divide-white/10 border-white/10" : "divide-stone border-stone")} id={id}>
      {items.map((item, i) => (
        <FAQRow
          key={i}
          index={i}
          item={item}
          open={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
          onKeyDown={onKeyDown}
          idBase={`${base}-${i}`}
          dark={dark}
        />
      ))}
    </div>
  );

  if (bare) return <div className={className}>{accordion}</div>;

  return (
    <section data-tone={dark ? "ink" : "paper"} className={cn("cv-auto", dark ? "bg-ink text-paper" : "bg-paper text-ink", "py-20 md:py-28 xl:py-32", className)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader overline={overline} title={title} intro={intro} tone={tone} align="stack" className="mb-0 lg:sticky lg:top-32" />
          </div>
          <Reveal y={24} className="lg:col-span-8">
            {accordion}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function FAQRow({
  index,
  item,
  open,
  onToggle,
  onKeyDown,
  idBase,
  dark,
}: {
  index: number;
  item: FAQItem;
  open: boolean;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => void;
  idBase: string;
  dark: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      if (first.current || isStatic()) {
        first.current = false;
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }
      gsap.to(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0, duration: 0.45, ease: "power3.inOut" });
    },
    { dependencies: [open] },
  );

  return (
    <div>
      <h3 className="m-0">
        <button
          type="button"
          data-faq
          id={`${idBase}-btn`}
          aria-expanded={open}
          aria-controls={`${idBase}-panel`}
          onClick={onToggle}
          onKeyDown={(e) => onKeyDown(e, index)}
          className={cn(
            "group flex w-full items-start justify-between gap-6 py-5 text-left font-display text-[1.0625rem] font-semibold leading-snug md:py-6 md:text-lg",
            dark ? "text-paper hover:text-mango" : "text-ink hover:text-mango-text",
          )}
        >
          <span className="flex gap-4">
            <span className={cn("mt-1 shrink-0 whitespace-nowrap font-mono text-[11px] font-medium tabular-nums", dark ? "text-mist" : "text-slate")}>{String(index + 1).padStart(2, "0")}</span>
            <span>{item.q}</span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ease-out-expo",
              dark ? "border-white/15" : "border-stone",
              open && "rotate-45",
            )}
          >
            <Plus size={14} strokeWidth={1.75} />
          </span>
        </button>
      </h3>
      <div
        ref={panel}
        id={`${idBase}-panel`}
        role="region"
        aria-labelledby={`${idBase}-btn`}
        className="overflow-hidden"
        style={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      >
        <div className={cn("pb-6 pl-9 text-[1rem] leading-relaxed md:pr-16", dark ? "text-mist" : "text-slate")}>
          {typeof item.a === "string" ? <p>{item.a}</p> : item.a}
        </div>
      </div>
    </div>
  );
}
