// Crawl the site from "/" and report status codes and broken internal links.
// usage: node tools/crawl.mjs [baseUrl]
const base = process.argv[2] ?? "http://localhost:3100";
const seen = new Map(); // path -> status
const referrers = new Map(); // path -> Set(from)
const queue = ["/"];

const norm = (href) => {
  try {
    const u = new URL(href, base);
    if (u.origin !== new URL(base).origin) return null;
    if (/\.(png|jpe?g|webp|svg|ico|bin|css|js|txt|xml|pdf)$/i.test(u.pathname)) return null;
    if (u.pathname.startsWith("/_next")) return null;
    return u.pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
};

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  let res;
  try {
    res = await fetch(base + path, { redirect: "manual" });
  } catch (e) {
    seen.set(path, "ERR " + e.message);
    continue;
  }
  seen.set(path, res.status);
  if (res.status >= 300 && res.status < 400) {
    const loc = norm(res.headers.get("location") ?? "");
    if (loc && !seen.has(loc)) queue.push(loc);
    continue;
  }
  if (res.status !== 200) continue;
  const html = await res.text();
  for (const m of html.matchAll(/href="([^"#?]*)(?:[?#][^"]*)?"/g)) {
    const p = norm(m[1]);
    if (!p) continue;
    if (!referrers.has(p)) referrers.set(p, new Set());
    referrers.get(p).add(path);
    if (!seen.has(p) && !queue.includes(p)) queue.push(p);
  }
}

const rows = [...seen.entries()].sort((a, b) => a[0].localeCompare(b[0]));
let bad = 0;
for (const [p, s] of rows) {
  const ok = s === 200 || (typeof s === "number" && s >= 300 && s < 400);
  if (!ok) bad++;
  console.log(`${ok ? "ok " : "BAD"} ${s}  ${p}${ok ? "" : "  ← from " + [...(referrers.get(p) ?? [])].slice(0, 3).join(", ")}`);
}
console.log(`\n${rows.length} paths, ${bad} broken`);
