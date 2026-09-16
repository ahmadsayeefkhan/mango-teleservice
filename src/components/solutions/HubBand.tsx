import { Reveal } from "@/components/motion/Reveal";
import { SignalLine } from "@/components/motion/SignalLine";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { hub } from "@/content/solutions";

/** "One contract. One support line. One accountable team." Ink band with a Signal Line divider. */
export function HubBand() {
  const b = hub.band;
  return (
    <Section tone="ink" ariaLabelledby="hub-band-title" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(254,202,38,0.08),transparent)]" />
      <Container className="relative">
        <SignalLine progress="scroll" tone="dark" start="top 80%" end="bottom 60%" className="mb-12 md:mb-16" />
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-8">
            <Reveal y={16} className="mb-5">
              <Overline tone="dark">{b.overline}</Overline>
            </Reveal>
            <SplitHeading as="h2" id="hub-band-title" className="text-h2 max-w-[18ch] text-balance">
              {b.title}
            </SplitHeading>
            <Reveal y={24} delay={0.15} className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mist">
              <p>{b.body}</p>
            </Reveal>
          </div>
          <Reveal y={24} delay={0.25} className="lg:col-span-4 lg:justify-self-end">
            <Button href={b.cta.href} variant="primary" tone="dark" size="lg" magnetic>
              {b.cta.label}
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
