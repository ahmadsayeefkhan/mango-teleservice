import { clsx, type ClassValue } from "clsx";

/** Merge class names (clsx). Tailwind v4 has no conflict merging; order your classes deliberately. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** True for hrefs that should not go through next/link (external, mailto, tel, hash-only). */
export function isExternalHref(href: string) {
  return /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);
}

/** "+880 1730 068810" → "tel:+8801730068810" */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Split a proof figure like "7+" / "24/7" / "2008" into a numeric part and a suffix for counters. */
export function parseFigure(value: string): { number: number; suffix: string } | null {
  const m = value.trim().match(/^(\d[\d,]*)(.*)$/);
  if (!m) return null;
  return { number: Number(m[1].replace(/,/g, "")), suffix: m[2] };
}

/** Zero-pad to `len` digits. */
export function pad(n: number, len = 2) {
  return String(Math.max(0, Math.floor(n))).padStart(len, "0");
}
