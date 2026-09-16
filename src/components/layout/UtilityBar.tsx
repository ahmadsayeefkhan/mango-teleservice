import { ArrowUpRight, Phone } from "lucide-react";
import { StatusPill } from "@/components/sections/StatusPill";
import { Container } from "@/components/ui/Container";
import { contacts, utilityBar } from "@/content/site";
import { cn, telHref } from "@/lib/utils";

/**
 * Thin Ink strip above the header: status pill, 24/7 support phone, Mango CA ↗, Cloud login ↗, EN | বাংলা.
 * Scrolls away with the page (the SiteHeader below it is sticky).
 */
export function UtilityBar() {
  return (
    <div data-tone="ink" className="relative z-40 border-b border-white/10 bg-ink text-mist">
      <Container className="flex h-9 min-w-0 items-center justify-between gap-4 overflow-hidden font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]">
        <div className="flex min-w-0 items-center gap-4 whitespace-nowrap">
          <StatusPill label={utilityBar.status} variant="bare" tone="dark" className="shrink-0" />
          <span className="hidden items-center gap-2 sm:inline-flex">
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <a href={telHref(contacts.supportPhone)} className="inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-paper">
              <Phone size={11} strokeWidth={1.75} aria-hidden="true" className="md:hidden" />
              <span className="hidden md:inline">{utilityBar.supportLabel}:</span>
              <span className="text-paper/90">{contacts.supportPhone}</span>
            </a>
          </span>
        </div>
        <div className="hidden items-center gap-5 md:flex">
          {utilityBar.links.map((l) => (
            <a key={l.label} href={l.href} className="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-paper">
              {l.label}
              <ArrowUpRight size={11} strokeWidth={1.75} aria-hidden="true" />
            </a>
          ))}
          <span className="inline-flex items-center gap-1.5" aria-label="Language: English">
            {utilityBar.languages.map((lang, i) => (
              <span key={lang.code} className="inline-flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-white/20">
                    |
                  </span>
                )}
                <span
                  lang={lang.code}
                  className={cn(lang.code === "bn" && "font-bn text-[12px] normal-case tracking-normal", lang.active ? "text-paper" : "text-mist")}
                  aria-current={lang.active ? "true" : undefined}
                >
                  {lang.label}
                </span>
              </span>
            ))}
          </span>
        </div>
      </Container>
    </div>
  );
}
