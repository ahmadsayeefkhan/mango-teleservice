import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Verify } from "@/components/ui/Verify";
import { cn } from "@/lib/utils";
import { caseStudiesHub, type CaseStudy } from "@/content/resources";

/** Case-study rows: image left, story right. Drafts are flagged and not linked. */
export function CaseStudyList({ items }: { items: CaseStudy[] }) {
  return (
    <Reveal stagger={0.1} as="ul" className="flex flex-col gap-5 md:gap-6" aria-label="Case studies">
      {items.map((cs) => {
        const published = cs.status === "published";
        const body = (
          <>
            <ParallaxImage
              src={cs.image.src}
              alt={cs.image.alt}
              speed={0.1}
              className={cn("aspect-[16/10] md:col-span-5 md:aspect-auto md:min-h-[260px]", !published && "grayscale")}
              sizes="(min-width: 768px) 40vw, 100vw"
            />
            <div className="flex flex-col p-6 md:col-span-7 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango-text">{cs.kicker}</p>
                <Tag variant={published ? "good" : "warn"}>{published ? caseStudiesHub.publishedLabel : caseStudiesHub.draftLabel}</Tag>
              </div>
              <h2 className={cn("mt-4 font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.5rem]", published && "transition-colors group-hover:text-mango-text")}>
                {published ? cs.title : <Verify note="client approval">{cs.title}</Verify>}
              </h2>
              <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-slate">{cs.summary}</p>
              <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-stone pt-5 md:pt-6">
                {cs.stats.map((s) => (
                  <div key={s.v}>
                    <dt className="sr-only">{s.v}</dt>
                    <dd className="font-display text-[1.25rem] font-semibold leading-none tracking-[-0.02em] md:text-[1.5rem]">
                      {s.verify ? <Verify note={s.verify}>{s.k}</Verify> : s.k}
                    </dd>
                    <dd className="mt-1.5 text-[12.5px] text-slate">{s.v}</dd>
                  </div>
                ))}
              </dl>
              {published && (
                <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold">
                  Read the case study
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </span>
              )}
            </div>
          </>
        );
        const cls = "grid overflow-hidden rounded-3xl border border-stone bg-white md:grid-cols-12";
        return (
          <li key={cs.slug}>
            {published ? (
              <Link href={`/resources/case-studies/${cs.slug}`} className={cn(cls, "group transition-colors duration-300 hover:border-ink/60")}>
                {body}
              </Link>
            ) : (
              <div className={cls} aria-label={`${cs.client}, draft awaiting approval`}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </Reveal>
  );
}
