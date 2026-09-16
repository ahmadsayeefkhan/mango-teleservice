import type { Metadata } from "next";
import { BadgeCheck, Check, Cloud, Phone, Receipt, Siren } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SupportStatusCard } from "@/components/conversion/SupportStatusCard";
import { Reveal } from "@/components/motion/Reveal";
import { SignalLine } from "@/components/motion/SignalLine";
import { CTABand } from "@/components/sections/CTABand";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { contacts, standardCta } from "@/content/site";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { cn, telHref } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "24/7 Support & Network Status",
  description:
    "Something wrong? We're awake. Mango's operations team monitors the network and data centre 24 hours a day. Fault hotline +880 1730 068810, Mango Cloud support and escalation path.",
  path: "/support",
});

type Tile = { icon: LucideIcon; hours: string; title: string; body: string; lines: { label: string; href?: string; verify?: string }[] };

const TILES: Tile[] = [
  {
    icon: Siren,
    hours: "24/7",
    title: "Outage or service fault",
    body: "Connectivity, circuit or data centre issue.",
    lines: contacts.phones.map((p) => ({ label: p, href: telHref(p) })),
  },
  {
    icon: Cloud,
    hours: "24/7",
    title: "Mango Cloud support",
    body: "Servers, storage, backup and access.",
    lines: [
      { label: contacts.emails.cloud, href: `mailto:${contacts.emails.cloud}` },
      { label: "WhatsApp / Viber [VERIFY]", verify: "WhatsApp / Viber numbers" },
    ],
  },
  {
    icon: BadgeCheck,
    hours: "Business hours",
    title: "Digital certificate help",
    body: "Issuance, tokens, renewals and SSL.",
    lines: [{ label: "mangoca.com support [VERIFY]", verify: "Mango CA support channel" }],
  },
  {
    icon: Receipt,
    hours: "Business hours",
    title: "Billing & accounts",
    body: "Invoices, payments and contracts.",
    lines: [{ label: "[VERIFY: billing@mango.com.bd]", verify: "billing address" }],
  },
];

const HAVE_READY = ["Your customer or circuit ID", "Service affected", "Time the issue started", "Any traceroute or error message"];

const ESCALATION = [
  { level: "L1", title: "Operations desk", body: "Triage, diagnostics, customer updates" },
  { level: "L2", title: "Senior engineer", body: "Routing, optical and carrier coordination" },
  { level: "L3", title: "Head of Network Operations", body: "Major incidents and executive communication" },
];

export default function SupportPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Support", href: "/support" }])} />
      <PageHero
        overline="SUPPORT"
        title="Something wrong? We're awake."
        sub="Our operations team monitors the network and data centre 24 hours a day, every day of the year."
        aside={<SupportStatusCard />}
        asideBare
      >
        <Reveal y={24} delay={0.3} className="mt-8">
          <a
            href={telHref(contacts.supportPhone)}
            className="group inline-flex items-center gap-4 rounded-2xl bg-mango px-5 py-4 text-ink transition-colors duration-200 hover:bg-mango-deep focus-visible:outline-mango md:px-6"
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink/10 transition-transform duration-300 ease-out-expo group-hover:-rotate-12">
              <Icon icon={Phone} size={20} />
            </span>
            <span className="flex flex-col">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/70">24/7 fault hotline</span>
              <span className="font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.625rem]">{contacts.supportPhone}</span>
            </span>
          </a>
        </Reveal>
      </PageHero>

      {/* Contact tiles */}
      <Section tone="paper" id="reach-us" ariaLabelledby="reach-title">
        <Container>
          <SectionHeader overline="HOW TO REACH US" title="The right team, first time." align="stack" id="reach-title" className="mb-10 md:mb-12" />
          <Reveal stagger={0.07} as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map((t) => (
              <li key={t.title} className="group flex flex-col rounded-2xl border border-stone bg-white p-6 transition-colors duration-300 hover:border-ink/30">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-stone bg-paper text-ink transition-colors duration-300 group-hover:border-mango group-hover:bg-mango">
                    <Icon icon={t.icon} size={20} />
                  </span>
                  <span
                    className={cn(
                      "inline-flex h-6 items-center rounded-full border px-2.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em]",
                      t.hours === "24/7" ? "border-mango-deep/60 text-mango-text" : "border-stone text-slate",
                    )}
                  >
                    {t.hours}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">{t.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate">{t.body}</p>
                <ul className="mt-auto flex flex-col gap-1.5 border-t border-stone pt-4 font-mono text-[11.5px] tracking-[0.02em]">
                  {t.lines.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a href={l.href} className="text-ink underline-offset-4 transition-colors hover:text-mango-text hover:underline">
                          {l.label}
                        </a>
                      ) : (
                        <span className="text-slate">
                          <Verify note={l.verify}>{l.label}</Verify>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Reveal>

          {/* Have ready + escalation */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Reveal y={32} className="rounded-3xl bg-stone/60 p-6 md:p-8">
              <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.015em]">When you call, have ready</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {HAVE_READY.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-[15px] text-ink">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-mango-text">
                      <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal y={32} delay={0.1} className="rounded-3xl bg-ink p-6 text-paper md:p-8">
              <section data-tone="ink" aria-labelledby="escalation-title">
                <h3 id="escalation-title" className="font-display text-[1.25rem] font-semibold tracking-[-0.015em]">
                  Escalation path
                </h3>
                <div className="mt-6 flex gap-5">
                  <SignalLine orientation="vertical" progress="scroll" tone="dark" start="top 75%" end="bottom 45%" className="my-4" />
                  <ol className="flex flex-1 flex-col">
                    {ESCALATION.map((e, i) => (
                      <li key={e.level} className={cn("flex items-start gap-4 py-4", i < ESCALATION.length - 1 && "border-b border-white/10")}>
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-mango font-mono text-[11px] font-medium text-ink">{e.level}</span>
                        <span className="flex flex-col">
                          <span className="font-display text-[15.5px] font-semibold">{e.title}</span>
                          <span className="text-[13.5px] text-mist">{e.body}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="mt-5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-mist">
                  <Verify note="response windows per contract">[VERIFY: response windows per contract]</Verify>
                </p>
              </section>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand
        overline="NOT A CUSTOMER YET?"
        title={standardCta.title}
        body={standardCta.body}
        primary={standardCta.primary}
        secondary={{ label: `Call ${contacts.supportPhone}`, href: telHref(contacts.supportPhone) }}
        tone="paper"
        className="pt-0 md:pt-0"
      />
    </>
  );
}
