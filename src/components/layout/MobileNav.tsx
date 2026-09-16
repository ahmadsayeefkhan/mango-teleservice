"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Mail, Phone, X } from "lucide-react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { lockScroll } from "@/components/motion/lenis-store";
import { Button } from "@/components/ui/Button";
import { contacts, mainNav, primaryCta, utilityBar } from "@/content/site";
import { cn, telHref } from "@/lib/utils";
import { Logo } from "./Logo";
import { StatusPill } from "@/components/sections/StatusPill";

export type MobileNavProps = { open: boolean; onClose: () => void };

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen Ink overlay navigation for < lg: staggered links, accordion groups, focus trap,
 * Escape to close, scroll lock (Lenis-aware).
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const root = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>("Solutions");
  const lastFocus = useRef<HTMLElement | null>(null);

  // Scroll lock + focus management + Escape + trap.
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const el = root.current!;
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !open || isStatic()) return;
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(el, { yPercent: -4, autoAlpha: 0, duration: 0.4, ease: "power3.out" });
      gsap.from(el.querySelectorAll("[data-stagger]"), { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", delay: 0.1, clearProps: "all" });
    },
    { scope: root, dependencies: [open] },
  );

  if (!open) return null;

  return (
    <div
      ref={root}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      data-tone="ink"
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-paper lg:hidden"
    >
      <div className="flex h-[68px] shrink-0 items-center justify-between px-5 md:px-8">
        <Logo />
        <button type="button" onClick={onClose} aria-label="Close menu" className="inline-flex size-11 items-center justify-center rounded-lg border border-white/15 text-paper">
          <X size={22} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 px-5 pb-10 pt-4 md:px-8">
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {mainNav.map((item) => {
            if (item.kind === "link") {
              return (
                <li key={item.label} data-stagger>
                  <Link href={item.href} onClick={onClose} className="flex items-center justify-between py-4 font-display text-[1.375rem] font-semibold">
                    {item.label}
                  </Link>
                </li>
              );
            }
            const isOpen = expanded === item.label;
            const id = `mnav-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <li key={item.label} data-stagger>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className="flex w-full items-center justify-between py-4 text-left font-display text-[1.375rem] font-semibold"
                >
                  {item.label}
                  <ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                </button>
                <div id={id} hidden={!isOpen} className="pb-5">
                  {item.kind === "mega" ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {item.columns.map((col) => (
                        <div key={col.title}>
                          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">{col.title}</p>
                          <ul>
                            {col.items.map((l) => (
                              <li key={l.href}>
                                <Link href={l.href} onClick={onClose} className="block py-2 text-[15px] text-paper/85 hover:text-paper">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link href={item.href} onClick={onClose} className="text-sm text-mist underline-offset-4 hover:underline">
                        Browse all solutions →
                      </Link>
                    </div>
                  ) : (
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {item.items.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} onClick={onClose} className="block py-2 text-[15px] text-paper/85 hover:text-paper">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={item.href} onClick={onClose} className="block py-2 text-sm text-mist underline-offset-4 hover:underline">
                          {item.label === "Industries" ? "All industries →" : "About Mango →"}
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div data-stagger className="mt-6 flex flex-col gap-3">
          <Button href={primaryCta.href} variant="primary" tone="dark" onClick={onClose} className="w-full">
            {primaryCta.label}
          </Button>
          <Button href={telHref(contacts.supportPhone)} variant="secondary" tone="dark" icon="phone" className="w-full">
            Call {contacts.supportPhone}
          </Button>
        </div>

        <div data-stagger className="mt-8 flex flex-col gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mist">
          <StatusPill label={utilityBar.status} variant="bare" tone="dark" />
          <a href={`mailto:${contacts.emails.general}`} className="inline-flex items-center gap-2 hover:text-paper">
            <Mail size={12} strokeWidth={1.75} aria-hidden="true" />
            {contacts.emails.general}
          </a>
          <a href={telHref(contacts.phones[1])} className="inline-flex items-center gap-2 hover:text-paper">
            <Phone size={12} strokeWidth={1.75} aria-hidden="true" />
            {contacts.phones[1]}
          </a>
          <div className="flex flex-wrap gap-4 pt-2">
            {utilityBar.links.map((l) => (
              <a key={l.label} href={l.href} className="inline-flex items-center gap-1 hover:text-paper">
                {l.label}
                <ArrowUpRight size={11} strokeWidth={1.75} aria-hidden="true" />
              </a>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="text-paper">EN</span>
              <span className="text-white/20">|</span>
              <span lang="bn" className="font-bn text-[12px] normal-case tracking-normal">
                বাংলা
              </span>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}
