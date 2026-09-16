import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { careersHero as h } from "@/content/careers";

/**
 * Careers hero (Ink): text column left, NOC team photo bleeding off the right edge with the
 * foundation's clip-path reveal + parallax. On mobile the photo sits under the copy.
 */
export function CareersHero() {
  return (
    <header data-tone="ink" className="relative overflow-hidden bg-ink text-paper" aria-labelledby="careers-title">
      {/* Photo: absolute right half on desktop */}
      <div className="relative order-2 lg:absolute lg:inset-y-0 lg:left-1/2 lg:right-0">
        <ParallaxImage
          src={h.image.src}
          alt={h.image.alt}
          speed={0.12}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-[16/10] w-full sm:aspect-[2/1] lg:absolute lg:inset-0 lg:aspect-auto"
          imgClassName="object-[62%_40%]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/25 lg:to-transparent lg:via-35%" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-t from-ink to-transparent lg:block" />
      </div>

      <Container className="relative">
        <div className="pb-4 pt-10 md:pt-14 lg:min-h-[560px] lg:pb-24 lg:pt-20 xl:min-h-[600px]">
          <div className="max-w-[640px]">
            <Reveal y={16} className="mb-6">
              <Overline tone="dark">{h.overline}</Overline>
            </Reveal>
            <SplitHeading as="h1" id="careers-title" className="text-h1 max-w-[19ch] text-balance">
              {h.title}
            </SplitHeading>
            <Reveal y={24} delay={0.3} className="mt-7 max-w-[48ch] text-body-l text-mist">
              <p>{h.sub}</p>
            </Reveal>
            <Reveal y={24} delay={0.45} className="mt-9 flex flex-wrap gap-3">
              <Button href={h.primary.href} variant="primary" tone="dark" magnetic>
                {h.primary.label}
              </Button>
              <Button href={h.secondary.href} variant="secondary" tone="dark" icon="none">
                {h.secondary.label}
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </header>
  );
}
