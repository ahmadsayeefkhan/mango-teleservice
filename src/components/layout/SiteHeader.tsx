"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { mainNav, primaryCta, type NavItem } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

/**
 * Sticky site header: logo lockup, desktop nav with Solutions mega-menu (4 columns) and
 * Industries / Company dropdowns, "Talk to an engineer" CTA. Ink surface that gains blur + border
 * after scroll; hides on scroll down and returns on scroll up. Mobile: hamburger → MobileNav.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef<string | null>(null);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Close menus on navigation (derived-state pattern: adjust state while rendering).
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  // Scroll behaviour.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 24);
        if (openRef.current) return;
        if (self.direction === 1 && y > 200) setHidden(true);
        else if (self.direction === -1) setHidden(false);
      },
    });
    return () => st.kill();
  }, []);

  // Escape + outside click close desktop menus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        header.current?.querySelector<HTMLElement>(`[data-nav-trigger="${open}"]`)?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const scheduleOpen = useCallback((label: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(label), 60);
  }, []);
  const scheduleClose = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(null), 160);
  }, []);

  const onBlurCapture = (e: React.FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && !e.currentTarget.contains(next)) setOpen(null);
  };

  return (
    <>
      <header
        ref={header}
        data-tone="ink"
        onBlurCapture={onBlurCapture}
        className={cn(
          "sticky top-0 z-50 text-paper transition-[transform,background-color,border-color] duration-500 ease-out-expo",
          scrolled || open ? "border-b border-white/10 bg-ink/85 backdrop-blur-md supports-[backdrop-filter]:bg-ink/80" : "border-b border-transparent bg-ink",
          hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <Container className="flex h-[68px] min-w-0 items-center justify-between gap-6 md:h-[76px]">
          <Logo className="shrink-0" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <NavEntry
                  key={item.label}
                  item={item}
                  active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("/").slice(0, 2).join("/")))}
                  open={open === item.label}
                  onEnter={() => item.kind !== "link" && scheduleOpen(item.label)}
                  onLeave={scheduleClose}
                  onToggle={() => setOpen(open === item.label ? null : item.label)}
                />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Button href={primaryCta.href} variant="primary" tone="dark" size="sm">
                {primaryCta.label}
              </Button>
            </div>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-lg bg-mango text-ink lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </Container>

        {/* Desktop panels */}
        {mainNav.map((item) =>
          item.kind === "link" ? null : (
            <DesktopPanel key={item.label} item={item} open={open === item.label} onEnter={() => scheduleOpen(item.label)} onLeave={scheduleClose} />
          ),
        )}
      </header>

      <MobileNav open={mobileOpen} onClose={closeMobile} />
    </>
  );
}

function NavEntry({
  item,
  active,
  open,
  onEnter,
  onLeave,
  onToggle,
}: {
  item: NavItem;
  active: boolean;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}) {
  const base = cn(
    "inline-flex h-10 items-center gap-1 rounded-md px-3 text-[14.5px] font-medium transition-colors",
    active || open ? "text-paper" : "text-paper/75 hover:text-paper",
  );
  if (item.kind === "link") {
    return (
      <li>
        <Link href={item.href} className={base} aria-current={active ? "page" : undefined}>
          {item.label}
        </Link>
      </li>
    );
  }
  const panelId = `nav-panel-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <li className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className={cn(base, "gap-0 px-0")}>
        <Link href={item.href} className="inline-flex h-10 items-center pl-3 pr-1" aria-current={active ? "page" : undefined}>
          {item.label}
        </Link>
        <button
          type="button"
          data-nav-trigger={item.label}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Close" : "Open"} ${item.label} menu`}
          onClick={onToggle}
          className="inline-flex h-10 items-center pr-3 pl-0.5"
        >
          <ChevronDown size={14} strokeWidth={1.75} aria-hidden="true" className={cn("transition-transform duration-300", open && "rotate-180")} />
        </button>
      </div>
      {/* underline indicator */}
      <span aria-hidden="true" className={cn("absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-mango transition-transform duration-300 ease-out-expo origin-left", open ? "scale-x-100" : "scale-x-0")} />
    </li>
  );
}

function DesktopPanel({ item, open, onEnter, onLeave }: { item: Exclude<NavItem, { kind: "link" }>; open: boolean; onEnter: () => void; onLeave: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const panelId = `nav-panel-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !open || isStatic()) return;
      const cols = el.querySelectorAll("[data-col]");
      gsap.set(el, { autoAlpha: 0, y: -8 });
      gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" });
      gsap.from(cols, { y: 14, autoAlpha: 0, duration: 0.55, stagger: 0.06, ease: "power3.out", delay: 0.05, clearProps: "all" });
    },
    { scope: ref, dependencies: [open] },
  );

  if (!open) return null;

  return (
    <div
      ref={ref}
      id={panelId}
      role="region"
      aria-label={`${item.label} menu`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-ink text-paper shadow-menu lg:block"
    >
      <Container className="py-8">
        {item.kind === "mega" ? (
          <>
            <div className="grid grid-cols-4 gap-8">
              {item.columns.map((col) => (
                <div key={col.title} data-col>
                  <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">
                    <span aria-hidden="true" className="inline-block h-0.5 w-4 bg-mango" />
                    {col.title}
                  </p>
                  <ul className="flex flex-col">
                    {col.items.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="group/item -mx-3 block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.05]">
                          <span className="flex items-center gap-2 text-[14.5px] font-semibold text-paper">
                            {l.label}
                            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100 text-mango" />
                          </span>
                          {l.desc && <span className="mt-0.5 block text-[13px] leading-snug text-mist">{l.desc}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div data-col className="mt-8 flex items-center justify-between gap-6 border-t border-white/10 pt-6">
              <p className="text-sm text-mist">
                {item.footer.prompt}{" "}
                <Link href={item.href} className="text-paper underline-offset-4 hover:underline">
                  Browse all solutions
                </Link>
              </p>
              <Button href={item.footer.cta.href} variant="ghost" tone="dark" className="text-sm">
                {item.footer.cta.label}
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            <div data-col className="col-span-4 border-r border-white/10 pr-8">
              <p className="mb-3 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">
                <span aria-hidden="true" className="inline-block h-0.5 w-4 bg-mango" />
                {item.label}
              </p>
              <p className="text-sm leading-relaxed text-mist">
                {item.label === "Industries"
                  ? "Built for organizations that can't afford downtime. Choose your sector to see the services that fit."
                  : "Bangladesh's first private-sector International Internet Gateway, licensed since 2008."}
              </p>
              <Button href={item.href} variant="ghost" tone="dark" className="mt-5 text-sm">
                {item.label === "Industries" ? "All industries" : "About Mango"}
              </Button>
            </div>
            <ul className="col-span-8 grid grid-cols-2 gap-x-8">
              {item.items.map((l) => (
                <li key={l.href} data-col>
                  <Link href={l.href} className="group/item -mx-3 block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.05]">
                    <span className="flex items-center gap-2 text-[14.5px] font-semibold text-paper">
                      {l.label}
                      <ArrowRight size={13} strokeWidth={2} aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100 text-mango" />
                    </span>
                    {l.desc && <span className="mt-0.5 block text-[13px] leading-snug text-mist">{l.desc}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </div>
  );
}
