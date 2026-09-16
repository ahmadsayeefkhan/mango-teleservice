import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { openRoleCount, teams } from "@/content/careers";
import { cn } from "@/lib/utils";

/** Careers §Teams: hover rows with open-role counts (Ink). Rows with openings link to the roles list. */
export function TeamsList() {
  return (
    <Reveal stagger={0.06} as="ul" className="border-t border-white/10">
      {teams.map((t) => {
        const n = openRoleCount(t.id);
        const inner = (
          <>
            <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-5">
              <span className="font-display text-[1.125rem] font-semibold tracking-[-0.01em] text-paper transition-colors duration-300 group-hover:text-mango md:text-[1.25rem]">{t.name}</span>
              <span className="text-[14px] text-mist">{t.line}</span>
            </span>
            <span className={cn("flex shrink-0 items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em]", n > 0 ? "text-mango" : "text-mist/60")}>
              <span>
                [{n}] open {n === 1 ? "role" : "roles"}
              </span>
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                aria-hidden="true"
                className={cn("transition-transform duration-300 ease-out-expo", n > 0 ? "group-hover:translate-x-1.5" : "opacity-40")}
              />
            </span>
          </>
        );
        const rowClass =
          "group relative flex items-center justify-between gap-6 border-b border-white/10 py-5 transition-colors duration-300 md:py-6";
        return (
          <li key={t.id}>
            {n > 0 ? (
              <Link href={`/careers#open-roles`} className={cn(rowClass, "px-1 hover:bg-white/[0.03] md:px-3")} aria-label={`${t.name}: ${n} open ${n === 1 ? "role" : "roles"}`}>
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-mango transition-transform duration-300 ease-out-expo group-hover:scale-y-100" />
                {inner}
              </Link>
            ) : (
              <div className={cn(rowClass, "px-1 md:px-3")}>{inner}</div>
            )}
          </li>
        );
      })}
    </Reveal>
  );
}
