import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export type BreadcrumbsProps = {
  /** Trail excluding Home (added automatically unless `includeHome` is false). Last item = current page. */
  items: Crumb[];
  tone?: "light" | "dark";
  includeHome?: boolean;
  className?: string;
};

/** Mono breadcrumb trail: HOME / SOLUTIONS / CONNECT / IP TRANSIT. */
export function Breadcrumbs({ items, tone = "dark", includeHome = true, className }: BreadcrumbsProps) {
  const dark = tone === "dark";
  const trail: Crumb[] = includeHome ? [{ label: "Home", href: "/" }, ...items] : items;
  return (
    <nav aria-label="Breadcrumb" className={cn("font-mono text-[11px] font-medium uppercase tracking-[0.12em]", dark ? "text-mist" : "text-slate", className)}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={i} className="flex items-center gap-3">
              {c.href && !last ? (
                <Link href={c.href} className={cn("transition-colors", dark ? "hover:text-paper" : "hover:text-ink")}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && (dark ? "text-paper/80" : "text-ink/80"))}>
                  {c.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="opacity-50">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
