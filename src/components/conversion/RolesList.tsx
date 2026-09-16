import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { getTeam, roles } from "@/content/careers";

/** Careers §Open roles: card rows linking to the job detail page. */
export function RolesList() {
  return (
    <Reveal stagger={0.07} as="ul" className="flex flex-col gap-3">
      {roles.map((r) => {
        const team = getTeam(r.teamId);
        return (
          <li key={r.slug}>
            <Link
              href={`/careers/${r.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-stone bg-white p-5 transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/40 sm:flex-row sm:items-center sm:justify-between md:p-6"
            >
              <span className="flex min-w-0 flex-col gap-2">
                <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.01em] md:text-[1.125rem]">{r.title}</span>
                <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-slate">
                  <span className="text-mango-text">{team?.name}</span>
                  <span>{r.location}</span>
                  <span>{r.workplace}</span>
                  <span>{r.type}</span>
                  <span>[deadline]</span>
                </span>
              </span>
              <span className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-ink px-5 text-sm font-semibold text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-paper sm:self-auto">
                View &amp; apply
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        );
      })}
    </Reveal>
  );
}
