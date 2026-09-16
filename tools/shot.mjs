// Headless Chrome screenshot via CDP with real device emulation.
// usage: node shot.mjs <url> <out.png> <width> <height> [--full] [--wait=ms] [--scroll] [--mobile]
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, out, w = "1440", h = "900", ...flags] = process.argv.slice(2);
const full = flags.includes("--full");
const scroll = flags.includes("--scroll");
const mobile = flags.includes("--mobile");
const wait = Number((flags.find((f) => f.startsWith("--wait=")) || "--wait=2500").split("=")[1]);
const port = 9222 + Math.floor(Math.random() * 500);
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--mute-audio",
  `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "cdp-"))}`, "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let version;
for (let i = 0; i < 50; i++) {
  try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); break; } catch { await sleep(200); }
}
if (!version) { console.error("chrome did not start"); chrome.kill(); process.exit(1); }
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const logs = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) logs.push(`[${m.params.type}] ` + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 400));
  if (m.method === "Runtime.exceptionThrown") logs.push("[exception] " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 400));
};
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result))); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const s = (m, p) => send(m, p, sessionId);
await s("Page.enable"); await s("Runtime.enable");
await s("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile });
if (mobile) await s("Emulation.setTouchEmulationEnabled", { enabled: true });
await s("Page.navigate", { url });
await sleep(wait);
if (scroll) {
  const { cssContentSize } = await s("Page.getLayoutMetrics");
  for (let y = 0; y < cssContentSize.height; y += Math.round(+h * 0.6)) { await s("Runtime.evaluate", { expression: `window.scrollTo(0, ${y})` }); await sleep(120); }
  await s("Runtime.evaluate", { expression: "window.scrollTo(0,0)" }); await sleep(800);
}
const pre = flags.find((f) => f.startsWith("--pre="));
if (pre) {
  await s("Runtime.evaluate", { expression: pre.slice(6), awaitPromise: true });
  await sleep(Number((flags.find((f) => f.startsWith("--wait2=")) || "--wait2=1200").split("=")[1]));
}
let clip;
if (full) {
  const { cssContentSize } = await s("Page.getLayoutMetrics");
  await s("Emulation.setDeviceMetricsOverride", { width: +w, height: Math.ceil(cssContentSize.height), deviceScaleFactor: 1, mobile });
  await sleep(600);
  clip = { x: 0, y: 0, width: +w, height: Math.ceil(cssContentSize.height), scale: 1 };
}
const { data } = await s("Page.captureScreenshot", { format: "png", captureBeyondViewport: full, ...(clip ? { clip } : {}) });
writeFileSync(out, Buffer.from(data, "base64"));
const info = await s("Runtime.evaluate", { awaitPromise: true, expression: `(async () => { let n = 0; await new Promise(r => { const stop = performance.now() + 300; const f = () => { n++; performance.now() < stop ? requestAnimationFrame(f) : r(); }; requestAnimationFrame(f); setTimeout(r, 500); }); const st = [...document.querySelectorAll('[style]')]; return JSON.stringify({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, motion: document.documentElement.dataset.motion, preload: document.documentElement.hasAttribute('data-preload'), vis: document.visibilityState, rafIn300ms: n, hiddenInline: st.filter(e => /opacity: 0(;|$)/.test(e.getAttribute('style'))).length, jsHide: document.querySelectorAll('.js-hide').length, splitLines: document.querySelectorAll('.split-line').length, preloaderEl: !!document.querySelector('.preloader')}); })()` });
console.log(out, info.result.value);
const ev = flags.find((f) => f.startsWith("--eval="));
if (ev) {
  const r = await s("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: ev.slice(7) });
  console.log("EVAL:", JSON.stringify(r.result.value ?? r.result.description ?? r.exceptionDetails, null, 1));
}
if (flags.includes("--probe")) {
  const probe = await s("Runtime.evaluate", { expression: `(() => { const vw = document.documentElement.clientWidth; const o = []; document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); const inClip = el.closest('[style*="overflow"], .overflow-hidden, .marquee, header, .preloader'); if (r.right > vw + 1 && r.width > 0 && !inClip) o.push(el.tagName + ' .' + String(el.className).slice(0, 90) + ' w=' + Math.round(r.width) + ' right=' + Math.round(r.right)); }); return o.slice(0, 40).join('\\n'); })()` });
  console.log("OVERFLOW:\n" + probe.result.value);
}
if (logs.length) console.log("CONSOLE:\n" + logs.join("\n"));
ws.close(); chrome.kill(); process.exit(0);
