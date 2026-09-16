import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import type { Story } from "@/content/solutions";

/** Optional story band: photo (clip reveal + parallax) beside an Ink panel with kicker, title, body. */
export function StoryCard({ story }: { story: Story }) {
  return (
    <Section tone="paper" padding="tight" aria-label={story.title}>
      <Container>
        <div className="grid overflow-hidden rounded-3xl border border-stone md:grid-cols-2">
          <ParallaxImage src={story.image} alt={story.alt} speed={0.1} className="aspect-[16/10] w-full md:aspect-auto md:min-h-[360px]" sizes="(min-width: 768px) 50vw, 100vw" />
          <Reveal y={24} delay={0.1} className="tone-dark flex flex-col justify-center bg-ink p-7 text-paper md:p-10">
            <p className="mb-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango">
              {story.kickerVerify ? <Verify note={story.kickerVerify}>{story.kicker}</Verify> : story.kicker}
            </p>
            <h2 className="max-w-[22ch] font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.75rem]">{story.title}</h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-mist">{story.body}</p>
            {story.link && (
              <Link href={story.link.href} className="group mt-6 inline-flex items-center gap-2 text-[14.5px] font-semibold text-paper transition-colors hover:text-mango">
                {story.link.label}
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
              </Link>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
