import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { hub } from "@/content/solutions";
import { LayerTabs } from "./LayerTabs";

/**
 * Solutions hub hero (Ink): overline, hero-size SplitText H1 "Connect. Host. Secure. Manage.",
 * sub, and the layer tabs that smooth-scroll to each group.
 * `enter` = first-viewport CSS entrance on the lite tier (never gated on hydration).
 */
export function HubHero() {
  return (
    <header data-tone="ink" className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/2 h-[640px] w-[820px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(254,202,38,0.07),transparent)]" />
      <Container className="relative pb-16 pt-12 md:pb-24 md:pt-16 lg:pt-24">
        <Reveal y={16} className="mb-6" enter={0}>
          <Overline tone="dark">{hub.hero.overline}</Overline>
        </Reveal>
        <SplitHeading as="h1" className="text-hero max-w-[12ch] text-balance" enter={0.05}>
          {hub.hero.title}
        </SplitHeading>
        <Reveal y={24} delay={0.25} className="mt-7 max-w-[52ch] text-body-l text-mist" enter={0.12}>
          <p>{hub.hero.sub}</p>
        </Reveal>
        <Reveal y={24} delay={0.35} enter={0.18}>
          <LayerTabs layers={hub.layers.map(({ code, num, label }) => ({ code, num, label }))} />
        </Reveal>
      </Container>
    </header>
  );
}
