import Link from "next/link";
import { ArrowUpRight, Clock, LifeBuoy, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Verify } from "@/components/ui/Verify";
import { contacts } from "@/content/site";
import { telHref } from "@/lib/utils";

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contacts.address.mapQuery)}`;

/** Contact page side panel: head office (Ink card), map placeholder, existing-customer support link. */
export function ContactAside() {
  return (
    <div className="flex flex-col gap-4">
      <Reveal y={24} delay={0.15}>
        <div data-tone="ink" className="rounded-3xl bg-ink p-6 text-paper md:p-7">
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango">Head office</p>
          <p className="mt-4 text-[15px] leading-relaxed text-paper">
            {contacts.address.lines[0]},
            <br />
            {contacts.address.lines[1]}, Bangladesh
          </p>
          <ul className="mt-5 divide-y divide-white/10 border-t border-white/10">
            {contacts.phones.map((p) => (
              <li key={p}>
                <a href={telHref(p)} className="group flex items-center gap-3 py-3 text-[14px] text-paper/85 transition-colors hover:text-mango">
                  <Icon icon={Phone} size={16} className="text-mango" />
                  <span className="font-mono tracking-[0.02em]">{p}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contacts.emails.general}`} className="flex items-center gap-3 py-3 text-[14px] text-paper/85 transition-colors hover:text-mango">
                <Icon icon={Mail} size={16} className="text-mango" />
                {contacts.emails.general}
              </a>
            </li>
            <li>
              <a href={`mailto:${contacts.emails.cloud}`} className="flex items-center gap-3 py-3 text-[14px] text-paper/85 transition-colors hover:text-mango">
                <Icon icon={Mail} size={16} className="text-mango" />
                <span>
                  {contacts.emails.cloud} <span className="text-mist">· Cloud</span>
                </span>
              </a>
            </li>
            <li className="flex items-start gap-3 py-3 text-[14px] text-paper/85">
              <Icon icon={Clock} size={16} className="mt-0.5 text-mango" />
              <span>
                <Verify note="office hours">Sun–Thu 9:00–18:00</Verify> <span className="text-mist">· Support 24/7</span>
              </span>
            </li>
          </ul>
        </div>
      </Reveal>

      {/* Map placeholder (embedded pin to follow once the map key / privacy review is done) */}
      <Reveal y={24} delay={0.25}>
        <a
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-3xl border border-stone bg-stone/60"
          aria-label="Open Police Plaza Concord, Gulshan-1 in Google Maps (opens in a new tab)"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgb(90 100 114 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(90 100 114 / 0.12) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
            }}
          />
          <div className="relative flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="relative inline-flex size-11 items-center justify-center rounded-full bg-mango text-ink shadow-[0_0_0_8px_rgb(254_202_38_/_0.18)] transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5">
              <Icon icon={MapPin} size={20} />
            </span>
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">Google map · Gulshan-1</span>
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-ink">
              Open in Maps
              <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </a>
      </Reveal>

      <Reveal y={24} delay={0.32}>
        <Link href="/support" className="group flex items-center gap-4 rounded-2xl border border-stone bg-white p-5 transition-colors duration-300 hover:bg-paper">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-stone bg-paper text-ink transition-colors duration-300 group-hover:border-mango group-hover:bg-mango">
            <Icon icon={LifeBuoy} size={20} />
          </span>
          <span className="flex flex-col">
            <span className="font-display text-[15.5px] font-semibold">Existing customer?</span>
            <span className="inline-flex items-center gap-1 text-[13.5px] text-slate">
              Go to 24/7 support
              <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
