import { Inline } from "./Inline";
import { cn } from "@/lib/utils";
import type { ArticleSection, Block } from "@/content/resources";

/** Long-form article body: h2 sections (ids for the TOC) and typed blocks. */
export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div data-article-body className="max-w-[68ch]">
      {sections.map((s) => (
        <section key={s.id} id={s.id} data-section className="scroll-mt-32 pt-10 first:pt-0 md:pt-12">
          <h2 className="text-[1.5rem] leading-[1.2] tracking-[-0.02em] md:text-[1.75rem]">{s.heading}</h2>
          <div className="mt-5 flex flex-col gap-5">
            {s.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const P = "text-[1.0625rem] leading-[1.7] text-ink/85";

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "p":
      return (
        <p className={P}>
          <Inline text={block.text} />
        </p>
      );
    case "ul":
    case "ol": {
      const Tag = block.t;
      return (
        <Tag className={cn("flex flex-col gap-3 pl-1", block.t === "ol" ? "list-none [counter-reset:step]" : "list-none")}>
          {block.items.map((it, i) => (
            <li key={i} className={cn("relative pl-8", P)}>
              {block.t === "ol" ? (
                <span aria-hidden="true" className="absolute left-0 top-[0.35em] font-mono text-[11px] font-medium tracking-[0.08em] text-mango-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : (
                <span aria-hidden="true" className="absolute left-1 top-[0.8em] h-0.5 w-3 bg-mango-deep" />
              )}
              <Inline text={it} />
            </li>
          ))}
        </Tag>
      );
    }
    case "note":
      return (
        <aside className="rounded-2xl border border-stone border-l-[3px] border-l-mango bg-white p-5 md:p-6">
          {block.label && <p className="mb-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-mango-text">{block.label}</p>}
          <p className="text-[1rem] leading-[1.7] text-ink/85">
            <Inline text={block.text} />
          </p>
        </aside>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border border-stone bg-white">
          <table className="w-full min-w-[520px] border-collapse text-left text-[15px] leading-relaxed">
            <thead>
              <tr className="border-b border-stone">
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone">
              {block.rows.map((r, i) => (
                <tr key={i} className="align-top">
                  {r.map((c, j) => (
                    <td key={j} className={cn("px-4 py-3 text-ink/85", j === 0 && "font-semibold text-ink")}>
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
