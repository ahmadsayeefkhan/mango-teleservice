"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, EASE, onceTrigger } from "@/components/motion/gsap";
import { onIntroReady } from "@/components/motion/intro";
import { isStatic, takeOver } from "@/components/motion/mode";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { newsroom, type NewsPost } from "@/content/company";
import { cn } from "@/lib/utils";
import { useTopic } from "./newsroom-store";

function Kicker({ post, dark }: { post: NewsPost; dark?: boolean }) {
  return (
    <p className={cn("font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]", dark ? "text-mango" : "text-mango-text")}>
      {post.featured && <>{newsroom.featuredLabel} · </>}
      {post.topic} · {post.iso ? <time dateTime={post.iso}>{post.date}</time> : <Verify note={post.verify}>{post.date}</Verify>}
    </p>
  );
}

function MaybeLink({ href, className, children, label }: { href?: string; className?: string; children: ReactNode; label: string }) {
  if (href)
    return (
      <Link href={href} className={cn("group", className)} aria-label={label}>
        {children}
      </Link>
    );
  return <div className={cn("group", className)}>{children}</div>;
}

function Featured({ post }: { post: NewsPost }) {
  return (
    <MaybeLink href={post.href} label={`${post.title} — read the story`} className="grid overflow-hidden rounded-3xl border border-stone bg-white lg:grid-cols-12">
      <ParallaxImage src={post.image} alt={post.alt} speed={0.1} priority className="aspect-[16/10] w-full lg:col-span-7 lg:aspect-auto lg:min-h-[400px]" sizes="(min-width: 1024px) 58vw, 100vw" imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
      <div className="flex flex-col p-6 md:p-8 lg:col-span-5 lg:p-10">
        <Kicker post={post} />
        <h2 className="mt-4 font-display text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.875rem]">{post.verify ? <Verify note={post.verify}>{post.title}</Verify> : post.title}</h2>
        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-slate">{post.excerpt}</p>
        {post.href && (
          <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[14px] font-semibold">
            Read story
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </MaybeLink>
  );
}

function Card({ post }: { post: NewsPost }) {
  return (
    <MaybeLink href={post.href} label={post.href ? `${post.title} — read the story` : post.title} className="flex h-full flex-col">
      <span className={cn("relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-graphite", !post.alt && "opacity-90")}>
        <Image src={post.image} alt={post.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
      </span>
      <div className="mt-4">
        <Kicker post={post} />
        <h3 className="mt-2 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">{post.verify ? <Verify note={post.verify}>{post.title}</Verify> : post.title}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate">{post.excerpt}</p>
      </div>
    </MaybeLink>
  );
}

/** Newsroom feed: featured story + latest grid, filtered by the shared topic store; media contact card. */
export function NewsFeed() {
  const topic = useTopic();
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const posts = topic === "All" ? newsroom.posts : newsroom.posts.filter((p) => p.topic === topic);
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const latest = posts.filter((p) => p !== featured);

  // Reveal the feed on enter; on filter change, re-run a quick rise for the new set.
  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el) return;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-news]"));
      if (isStatic() || !nodes.length) {
        takeOver(el);
        return;
      }
      gsap.set(nodes, { opacity: 0, y: 20 });
      takeOver(el);
      const initial = first.current;
      first.current = false;
      const play = contextSafe!(() => {
        gsap.to(nodes, { opacity: 1, y: 0, duration: initial ? 1 : 0.6, stagger: 0.07, ease: EASE.reveal, scrollTrigger: initial ? onceTrigger(el, "top 85%") : undefined });
      });
      const cancel = onIntroReady(play);
      return () => cancel();
    },
    { scope: root, dependencies: [topic] },
  );

  return (
    <Section tone="paper" id="news" ariaLabelledby="news-title">
      <Container>
        <h2 id="news-title" className="sr-only">
          Latest news
        </h2>
        <div ref={root} className="js-hide" aria-live="polite">
          {featured ? (
            <div data-news key={`f-${featured.id}-${topic}`}>
              <Featured post={featured} />
            </div>
          ) : (
            <p data-news className="rounded-2xl border border-dashed border-stone px-6 py-10 text-center text-slate">
              {newsroom.empty}
            </p>
          )}
          {latest.length > 0 && (
            <>
              <p data-news className="mb-6 mt-16 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">
                {newsroom.latestLabel}
              </p>
              <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {latest.map((p) => (
                  <li key={`${p.id}-${topic}`} data-news>
                    <Card post={p} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Media contact */}
        <Reveal y={32} className="mt-16 md:mt-20">
          <div data-tone="ink" className="grid gap-6 rounded-3xl border border-white/10 bg-ink p-6 text-paper md:grid-cols-12 md:items-center md:p-8">
            <div className="md:col-span-8">
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango">{newsroom.media.overline}</p>
              <p className="mt-3 font-display text-[1.375rem] font-semibold tracking-[-0.02em] md:text-[1.5rem]">{newsroom.media.title}</p>
              <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-mist">
                <Verify note={newsroom.media.contactVerify}>{newsroom.media.contact}</Verify>
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <a href={newsroom.media.cta.href} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg bg-mango px-6 text-[15px] font-semibold leading-none text-ink transition-colors hover:bg-mango-deep focus-visible:outline-mango">
                {newsroom.media.cta.label}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
