import type { Metadata } from "next";
import Link from "next/link";
import { BrokenSignal } from "@/components/conversion/BrokenSignal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This route doesn't lead anywhere. The page may have moved during our website rebuild.",
  robots: { index: false, follow: false },
};

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section data-tone="ink" className="flex min-h-[calc(100svh-120px)] items-center bg-ink py-20 text-paper md:py-28" aria-labelledby="nf-title">
      <Container size="narrow" className="text-center">
        <Reveal y={16}>
          <p className="font-mono text-[clamp(4.5rem,2rem+9vw,8rem)] font-medium leading-none tracking-[-0.04em] text-mango" aria-hidden="true">
            404
          </p>
          <span className="sr-only">Error 404.</span>
        </Reveal>
        <BrokenSignal className="my-8" />
        <SplitHeading as="h1" id="nf-title" className="text-h2 mx-auto max-w-[18ch] text-balance" delay={0.5}>
          This route doesn&rsquo;t lead anywhere.
        </SplitHeading>
        <Reveal y={16} delay={0.75} className="mx-auto mt-5 max-w-[44ch] text-body-l text-mist">
          <p>The page may have moved during our website rebuild. Try one of these instead.</p>
        </Reveal>
        <Reveal y={16} delay={0.9} className="mt-8">
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Quick links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex h-10 items-center rounded-full border border-white/20 px-5 text-[14px] font-medium text-paper transition-colors duration-200 hover:border-mango hover:bg-mango hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
