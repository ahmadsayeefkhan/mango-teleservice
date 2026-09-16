import Link from "next/link";
import type { ReactNode } from "react";
import { Verify } from "@/components/ui/Verify";
import { isExternalHref } from "@/lib/utils";

const TOKEN_SRC = String.raw`\[\[([^\]|]+)\|([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*`;

/**
 * Renders the tiny inline markup used in content files:
 * `**bold**`, `[label](href)` and `[[text|verify note]]` (wrapped in <Verify>).
 */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  const token = new RegExp(TOKEN_SRC, "g");
  while ((m = token.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <Verify key={k++} note={m[2]}>
          {m[1]}
        </Verify>,
      );
    } else if (m[3] !== undefined) {
      const href = m[4];
      const cls = "font-medium text-ink underline decoration-mango-deep decoration-2 underline-offset-4 transition-colors hover:text-mango-text";
      out.push(
        isExternalHref(href) ? (
          <a key={k++} href={href} className={cls} target={/^https?:/.test(href) ? "_blank" : undefined} rel={/^https?:/.test(href) ? "noopener noreferrer" : undefined}>
            {m[3]}
          </a>
        ) : (
          <Link key={k++} href={href} className={cls}>
            {m[3]}
          </Link>
        ),
      );
    } else if (m[5] !== undefined) {
      out.push(
        <strong key={k++} className="font-semibold text-ink">
          {m[5]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
