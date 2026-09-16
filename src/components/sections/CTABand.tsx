import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/utils";

export type CTALink = { label: string; href: string };

export type CTABandProps = {
  title: string;
  body?: ReactNode;
  primary: CTALink;
  secondary?: CTALink;
  /** Mono eyebrow above the title. */
  overline?: string;
  /** Surrounding surface (adds section padding so the yellow panel floats on it). */
  tone?: "paper" | "ink" | "stone";
  className?: string;
};

/**
 * Mango-yellow conversion band with Ink text. Used at the end of most pages.
 * `<CTABand title="…" body="…" primary={{label,href}} secondary={{label,href}} />`
 */
export function CTABand({ title, body, primary, secondary, overline = "LET'S BUILD YOUR BACKBONE", tone = "paper", className }: CTABandProps) {
  const bg = tone === "ink" ? "bg-ink" : tone === "stone" ? "bg-stone/60" : "bg-paper";
  return (
    <section data-tone={tone} className={cn("cv-auto", bg, "py-16 md:py-24", className)} aria-label="Contact Mango">
      <Container>
        <Reveal y={40}>
          <div className="rounded-3xl bg-mango px-6 py-12 text-ink md:px-12 md:py-16 lg:px-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                {overline && (
                  <p className="mb-4 font-mono text-overline font-medium uppercase text-ink/80">{overline}</p>
                )}
                <SplitHeading as="h2" className="text-h2 max-w-[20ch]">
                  {title}
                </SplitHeading>
                {body && <div className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink/80">{typeof body === "string" ? <p>{body}</p> : body}</div>}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col lg:items-stretch lg:pl-8">
                <Button href={primary.href} variant="ink" icon={primary.href.startsWith("tel") ? "phone" : "arrow"} magnetic>
                  {primary.label}
                </Button>
                {secondary && (
                  <Button href={secondary.href} variant="secondary" className="focus-visible:outline-ink" icon={secondary.href.startsWith("tel") ? "phone" : "arrow"}>
                    {secondary.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
