import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Server, Waypoints, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { categoryLabel, readMinutes, type Article, type CategoryId } from "@/content/resources";

export const CATEGORY_ICON: Record<CategoryId, LucideIcon> = {
  connectivity: Waypoints,
  cloud: Server,
  "digital-trust": BadgeCheck,
  industry: Building2,
};

/** Grid card: category + icon, title, read link. */
export function ArticleCard({ article, className }: { article: Article; className?: string }) {
  return (
    <Link
      href={`/resources/insights/${article.slug}`}
      className={cn(
        "group flex h-full min-h-[200px] flex-col rounded-2xl border border-stone bg-white p-6 transition-[border-color,transform] duration-300 ease-out-expo hover:border-ink/60 motion-safe:hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango-text">
          {categoryLabel(article.category)}
          <span className="mx-1.5 text-stone">·</span>
          <span className="text-slate">{readMinutes(article)} min</span>
        </p>
        <Icon icon={CATEGORY_ICON[article.category]} size={18} className="text-slate transition-colors group-hover:text-ink" />
      </div>
      <h3 className="mt-5 font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-mango-text md:text-[1.1875rem]">{article.title}</h3>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold">
        Read article
        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
