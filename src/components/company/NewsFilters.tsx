"use client";

import { Reveal } from "@/components/motion/Reveal";
import { newsroom } from "@/content/company";
import { cn } from "@/lib/utils";
import { setTopic, useTopic, type TopicFilter } from "./newsroom-store";

const ALL: TopicFilter[] = ["All", ...newsroom.topics];

/** Topic pills (client-side filter). Lives in the hero; the feed below reads the same store. */
export function NewsFilters() {
  const topic = useTopic();
  return (
    <Reveal y={16} delay={0.4} className="mt-8">
      <div role="group" aria-label="Filter news by topic" className="flex flex-wrap gap-2">
        {ALL.map((t) => {
          const active = t === topic;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => setTopic(t)}
              className={cn(
                "h-9 rounded-full border px-4 text-[13.5px] font-semibold leading-none transition-colors duration-200 ease-out-expo focus-visible:outline-mango",
                active ? "border-mango bg-mango text-ink" : "border-white/20 bg-white/[0.04] text-paper hover:border-paper/60 hover:bg-white/10",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
    </Reveal>
  );
}
