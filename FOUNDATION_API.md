# Foundation API (as implemented): read before building pages

Barrels: `@/components/ui`, `@/components/motion`, `@/components/sections`, `@/components/layout`. Read the source when in doubt. **Do not modify these folders.**

## Screenshots (use this, not the brief's raw chrome command)
Plain `chrome --headless --window-size=390,…` lays out at ~560px, so mobile shots are wrong. Use the CDP tool with real device emulation:
```
node tools/shot.mjs <url> <out.png> <width> <height> [--full] [--mobile] [--scroll] [--wait=ms]
node tools/shot.mjs "http://localhost:3000/solutions?static=1" shots/solutions-1440.png 1440 900 --full
node tools/shot.mjs "http://localhost:3000/solutions?static=1" shots/solutions-390.png 390 844 --full --mobile
node tools/shot.mjs "http://localhost:3000/solutions" shots/solutions-motion.png 1440 900 --full --scroll --wait=4000
```
Save screenshots in your scratchpad or `website/shots/<area>/` (not `public/`). In dev, `window.__mango = { gsap, ScrollTrigger }` is exposed.

## ui
```tsx
<Button href? variant="primary"|"ink"|"secondary"|"ghost" tone="light"|"dark" icon="arrow"|"external"|"phone"|"none" size="sm"|"md"|"lg" magnetic className type onClick disabled target ariaLabel prefetch id>
  // internal href → next/link; http/mailto/tel → <a>; no href → <button>. "ink" = solid ink (use on yellow surfaces).
  // Tailwind v4 has no class merging: choose variant/size rather than overriding bg/height via className.
<Overline tone="light"|"dark" tick? as="p"|"span"|"div" className id>
<Section tone="paper"|"ink"|"stone"|"white"|"graphite" id className padding="default"|"tight"|"none" as ariaLabelledby style>
<Container size="default"(1200)|"wide"|"narrow" as className id>
<Tag variant="neutral"|"good"|"warn"|"bad" tone="light"|"dark">
<Verify note?>…</Verify>          // badge only when NEXT_PUBLIC_SHOW_VERIFY=1
<Icon icon={LucideIcon} size=24 strokeWidth=1.5 label? className>
```
## motion (all respect reduced motion and `?static=1`)
```tsx
<Reveal y=32 delay=0 stagger=0 as="div" className id start="top 88%" duration=1 style>   // stagger>0 animates direct children
<SplitHeading as="h1"|"h2"|"h3"|"p"|"div" className delay stagger=0.08 id>text</SplitHeading>
<Counter to from=0 duration=1.6 format? prefix suffix className start>
<SignalLine progress="scroll"|"auto"|number tone="light"|"dark" orientation="horizontal"|"vertical" trigger?={ref} start end className loopDuration>
<ParallaxImage src alt speed=0.15 className(must size the box) imgClassName priority sizes quality>
<Marquee speed=40 pauseOnHover className gapClassName ariaLabel>
<Magnetic strength=0.3 className>
// helpers: isStatic(), useMotionMode() ('full'|'static'|null), useMediaQuery(q), onIntroReady(cb), lockScroll(bool),
// scrollTo(target, offset), getLenis(), onceTrigger(el, start), EASE, MEDIA  (import from @/components/motion)
```
**Robustness pattern:** content is server-rendered visible. Elements JS will animate get the class `.js-hide` (hidden only under `html[data-motion=full]`, with a CSS fallback reveal after 2.5s); remove it the moment GSAP owns the element. Write custom page animations with `useGSAP` + `gsap.matchMedia()` and branch on `useMotionMode()`/`isStatic()`, so static mode shows the final state.

## sections
```tsx
<PageHero crumb=[{label,href?}] overline title sub primary={{label,href}} secondary aside asideBare image={{src,alt}} tone="ink"|"paper" size="h1"|"hero" className children>
<SectionHeader overline title intro tone="light"|"dark" align="split"|"stack" as="h2" action className id>
<ProofStrip items=[{k,v}] tone="dark"|"light" size="lg"|"md" animate bare className>   // leading integers count up; size="md" = compact mono strip (sol-* designs)
<CTABand title body primary secondary overline tone="paper"|"ink"|"stone" className>
<FAQ items=[{q,a}] title overline intro tone bare defaultOpen=0 className id>
<StatusPill label status="operational"|"degraded"|"incident" tone="light"|"dark" variant="pill"|"bare">
<Breadcrumbs items=[{label,href?}] tone includeHome=true>
```
## lib & content
- `@/lib/utils`: `cn`, `isExternalHref`, `telHref`, `parseFigure`, `pad`
- `@/lib/seo`: `SITE_URL`, `SITE_NAME`, `buildMetadata({...})`, `organizationJsonLd()`, `breadcrumbJsonLd(items)`, `absoluteUrl()`; `@/lib/JsonLd` component
- `@/content/site`: `site`, `contacts`, `solutionsMenu`, `industriesMenu`, `companyMenu`, `mainNav`, `footerNav`, `licences`, `primaryCta` (/contact), `quoteCta` (/contact?intent=quote), `standardCta`
- Header is in-flow `sticky`, so pages need no top offset.

## Cross-agent conventions
- Insight slugs: `what-is-an-international-internet-gateway`, `digital-signature-certificates-for-e-gp`, `data-centre-or-cloud-buyers-guide`
- Case study slug: `nbr-training`
- Quote CTA: `/contact?intent=quote` (contact page should preselect the quote flow when `intent=quote`)
- Next 16: use `preload` instead of the deprecated `priority` on `next/image`.
- Home is the quality reference: `src/components/home/**`, http://localhost:3000/?static=1
