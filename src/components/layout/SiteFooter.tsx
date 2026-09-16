import Link from "next/link";
import { SignalLine } from "@/components/motion/SignalLine";
import { Container } from "@/components/ui/Container";
import { Verify } from "@/components/ui/Verify";
import { contacts, footerNav, licences, site, type NavLink } from "@/content/site";
import { telHref } from "@/lib/utils";
import { Logo } from "./Logo";

function FooterList({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14.5px] text-paper/80 transition-colors hover:text-paper">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Ink footer: brand + blurb, Solutions / Company / Resources / Get in touch, licence strip with the
 * animated Signal Line, legal row.
 */
export function SiteFooter() {
  return (
    <footer data-tone="ink" className="cv-auto relative bg-ink text-paper">
      <Container className="pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-[34ch] text-[14.5px] leading-relaxed text-mist">{site.footerBlurb}</p>
          </div>
          <div className="lg:col-span-2">
            <FooterList title="Solutions" links={footerNav.solutions} />
          </div>
          <div className="lg:col-span-2">
            <FooterList title="Company" links={footerNav.company} />
          </div>
          <div className="lg:col-span-1">
            <FooterList title="Resources" links={footerNav.resources} />
          </div>
          <div className="lg:col-span-3 lg:pl-4">
            <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">Get in touch</p>
            <address className="flex flex-col gap-2.5 not-italic text-[14.5px] text-paper/80">
              {contacts.address.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              {contacts.phones.map((p) => (
                <a key={p} href={telHref(p)} className="transition-colors hover:text-paper">
                  {p}
                </a>
              ))}
              <a href={`mailto:${contacts.emails.general}`} className="transition-colors hover:text-paper">
                {contacts.emails.general}
              </a>
              <a href={`mailto:${contacts.emails.cloud}`} className="transition-colors hover:text-paper">
                {contacts.emails.cloud}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-16">
          <SignalLine progress="auto" tone="dark" />
          <ul className="flex flex-wrap gap-x-8 gap-y-2 pt-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mist">
            {licences.map((l, i) => (
              <li key={l}>{i === licences.length - 1 ? <Verify note="licence numbers">{l}</Verify> : l}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[12.5px] text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © {site.copyrightYear} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
