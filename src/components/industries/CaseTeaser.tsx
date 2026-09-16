import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { cn } from "@/lib/utils";
import type { IndustryCaseTeaser } from "@/content/industries";

/** Ink teaser card. Placeholder stories are wrapped in <Verify>; real ones show the photo. */
export function CaseTeaser({ story }: { story: IndustryCaseTeaser }) {
  const hasImage = Boolean(story.image);
  return (
    <Section tone="paper" padding="tight" className="pb-0 md:pb-0" aria-label="Case study">
      <Container>
        <Reveal y={32}>
          <div data-tone="ink" className={cn("overflow-hidden rounded-3xl border border-white/10 bg-ink text-paper", hasImage && "grid lg:grid-cols-12")}>
            {story.image && (
              <ParallaxImage src={story.image.src} alt={story.image.alt} speed={0.1} className="aspect-[16/9] lg:col-span-5 lg:aspect-auto lg:min-h-[280px]" sizes="(min-width: 1024px) 40vw, 100vw" />
            )}
            <div className={cn("flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-8 lg:p-10", hasImage && "lg:col-span-7")}>
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango">{story.kicker}</p>
                <p className="mt-3 max-w-[24ch] font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.625rem]">
                  {story.placeholder ? <Verify note="client name and outcome">{story.title}</Verify> : story.title}
                </p>
                <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-mist">
                  {story.body}
                  {story.placeholder && (
                    <>
                      {" "}
                      <Verify note="client approval">[Client approval required]</Verify>
                    </>
                  )}
                </p>
                {story.note && <p className="mt-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-mist/80">{story.note}</p>}
              </div>
              <div className="shrink-0">
                <Button href={story.href} variant="primary" tone="dark">
                  {story.cta}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
