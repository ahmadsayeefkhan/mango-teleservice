# Mango Teleservices — Website Build Brief (read fully before writing code)

You are building the production website for **Mango Teleservices Limited** (Dhaka, Bangladesh): Bangladesh's first private-sector International Internet Gateway (2008). The goal is an **Awwwards-level corporate site**, the most striking corporate website in Bangladesh, that still works as a fast, accessible B2B sales tool.

Quality bar: memorable motion and craft (Awwwards SOTD standard) **plus** usability (clear nav, readable copy, visible CTAs, WCAG 2.1 AA, Lighthouse ≥ 90 on desktop, ≥ 75 on mobile).

---

## 1. Stack (already installed; do not swap)

| Tool | Version | Notes |
|---|---|---|
| Next.js | 16.3 (App Router, Turbopack) | **APIs changed.** Read `node_modules/next/dist/docs/` for anything you use (routing, `params` as Promise, metadata, `next/font`, `next/image`, `generateStaticParams`). |
| React | 19.2 | |
| TypeScript | strict | |
| Tailwind CSS | 4.3 | Configure via `@theme` in `src/app/globals.css` (no tailwind.config.js). |
| GSAP | 3.15 | **All plugins are free** (ScrollTrigger, SplitText, Flip, MorphSVG, DrawSVG, ScrollSmoother…). Use `@gsap/react` `useGSAP()` for cleanup. |
| Lenis | 1.3 | Smooth scroll; drive it from `gsap.ticker`. |
| three / @react-three/fiber / drei / postprocessing | 0.186 / 9.7 / 10.7 / 3.1 | WebGL only where it earns its place. |
| lucide-react | 1.x | Icons (stroke 1.5). |

You may `npm install` small, well-maintained packages if truly needed (e.g. `topojson-client`, `world-atlas`, `d3-geo`). No UI kits (no MUI/shadcn/Chakra), no framer-motion (GSAP is the motion engine).

Windows note: the native SWC binary can be blocked by an app-control policy, but `npm run build` works. Always verify with `npm run build`.

## 2. Sources of truth (read what's relevant to your task)

| What | Where (relative to `website/`) |
|---|---|
| Brand system (colors, type, logo, imagery, motion, voice) | `../.claude/skills/mango-brand-guidelines/SKILL.md` + `references/tokens.css` |
| Content strategy, sitemap, claim governance | `../.claude/skills/mango-content-strategy/SKILL.md` |
| **Final page copy (use it verbatim; tighten only if needed)** | `../Website Content/01-Global-and-Home.md`, `02-Solutions.md`, `03-Company-and-Group.md`, `04-Industries-Resources-Careers-Contact.md` |
| Website plan (goals, UX principles) | `../Website Plan/01-Website-Plan.md` |
| **Visual design reference (approved Pen designs, PNG)** | `design-reference/*.png`. View them with your image-reading tool. The code should match the layout, hierarchy and visual language, and elevate it with motion. |
| Brand audit (known gaps to fix) | `../Brand Audit/brand audit.html` |
| Assets | `public/brand/mango-mark.png` (logo mark, transparent), `public/images/*` (AI hero/venture imagery, NBR training photos), `public/people/*` (leaders), `public/logos/*` (client/partner logos) |

Design-reference filenames: `home-1..5`, `home-mobile-1..2`, `brand-board`, `sol-hub-1..2`, `sol-ip-transit-1..3`, `sol-intl-circuits-*`, `sol-enterprise-internet-*`, `sol-data-connectivity-*`, `sol-data-centre-*`, `sol-cloud-*`, `sol-digital-trust-1..4`, `sol-managed-*`, `sol-software-*`, `sol-training-1..4`, `network-1..3`, `about-1..3`, `leadership-1..2`, `milestones-1..3`, `partners-1..2`, `group-1..3`, `newsroom-1..2`, `ind-hub-*`, `ind-isps-*`, `ind-banking-*`, `ind-government-*`, `ind-enterprise-*`, `ind-education-*`, `ind-digital-*`, `insights-*`, `article-*`, `case-studies-*`, `case-study-detail-*`, `faq-*`, `careers-1..3`, `job-detail-*`, `support-*`, `contact-*`, `privacy-1`, `thank-you-404-*`.

## 3. Design tokens (implement exactly)

Colors (Tailwind v4 `@theme` names → use as `bg-ink`, `text-mango`, etc.):

| Token | Hex | Job |
|---|---|---|
| `mango` | `#FECA26` | Brand signal: primary CTA fill, key numbers on dark, logo. ≤10% of any viewport. **Never text on light.** |
| `mango-deep` | `#E5AE00` | Hover of yellow; decorative ticks/lines ≥2px. Never text. |
| `mango-text` | `#7A5C00` | **Small accent text on light surfaces** (numerals, overlines, eyebrow labels). 5.9:1 on paper. |
| `ink` | `#0E1116` | Dark surfaces (hero, network, footer), primary text on light |
| `graphite` | `#1A1F27` | Cards/panels on dark |
| `paper` | `#FAF8F3` | Default page background |
| `stone` | `#E8E4DA` | Borders, alt sections |
| `slate` | `#5A6472` | Secondary text on light |
| `mist` | `#9AA3AF` | Secondary text on dark |
| `signal-green` | `#23A55A` | Status only |
| `signal-red` | `#D93A3A` | Errors only |

Button text on yellow is always `ink`. Borders over shadows. Radius: 8px buttons/inputs, 16px cards, 24px panels, full pills.

Typography (load with `next/font/google`, expose CSS variables):
- **Sora** 400/600/700 → `--font-display` (headings, weight 600, tracking −0.025em, leading 1.05–1.15)
- **DM Sans** 400/500/600 → `--font-body` (body ≥16px, leading 1.6)
- **JetBrains Mono** 500 → `--font-mono` (UPPERCASE overlines, data, tracking +0.12em)
- **Hind Siliguri** 400/600 (bengali subset) → `--font-bn`

Fluid type scale: hero `clamp(2.75rem, 1.2rem + 5.4vw, 6rem)`, h1 `clamp(2.25rem,1.4rem+3.2vw,4rem)`, h2 `clamp(1.875rem,1.2rem+2.2vw,3rem)`, h3 `clamp(1.25rem,1.05rem+.7vw,1.625rem)`.

Layout: max content width 1200px (container `px-5 md:px-8 xl:px-0`), section padding `py-20 md:py-28 xl:py-32`. Section rhythm alternates Ink (authority) and Paper/Stone (reading).

## 4. Architecture & shared component contract

```
src/
  app/
    layout.tsx               ← fonts, SmoothScroll, UtilityBar, SiteHeader, SiteFooter, Preloader
    page.tsx                 ← Home
    template.tsx             ← page-enter transition
    globals.css              ← tokens, base styles, Lenis css
    (routes…)
  components/
    layout/   UtilityBar, SiteHeader (desktop mega-menu), MobileNav, SiteFooter, Breadcrumbs
    motion/   SmoothScroll, Reveal, SplitHeading, Counter, SignalLine, Magnetic, ParallaxImage, Marquee, Preloader, gsap.ts (single registration point)
    ui/       Button, Overline, Section, Container, Tag, Verify, Icon
    sections/ PageHero, SectionHeader, ProofStrip, CTABand, FAQ, StatusPill
    three/    NetworkGlobe (client-only; dynamic import with ssr:false)
  content/    site.ts (nav, footer, contacts) + per-area data files
  lib/        utils (cn), seo helpers
```

### Contract: the foundation provides these. Page builders import and must not modify them.
If you need a variant, compose it in your own page-local component under `src/components/<area>/`.

```tsx
// ui
<Button href="/contact" variant="primary"|"secondary"|"ghost" tone="light"|"dark" icon="arrow" size="md"|"lg" magnetic>Label</Button>
<Overline tone="light"|"dark">WHAT WE DO</Overline>             // mono, tick line, mango-text on light / mango on dark
<Section tone="paper"|"ink"|"stone"|"white" id? className?>…</Section>   // handles padding + text color
<Container className?>…</Container>
<Tag variant="neutral"|"good"|"warn"|"bad">LABEL</Tag>
<Verify note="SLA %">99.95%</Verify>   // wraps unverified claims; shows a subtle dashed badge only when NEXT_PUBLIC_SHOW_VERIFY=1

// motion (all respect prefers-reduced-motion)
<Reveal y={32} delay={0} stagger={0.06} as="div">children</Reveal>     // fade/rise on enter; stagger applies to direct children
<SplitHeading as="h1"|"h2"|"h3" className? delay?>Text</SplitHeading>  // SplitText lines+mask reveal
<Counter to={2008} from={0} duration={1.6} format? />                  // count up when in view
<SignalLine progress="scroll"|"auto" tone="light"|"dark" />            // 2px rail with travelling mango dot (signature element)
<ParallaxImage src alt speed={0.15} className priority? />              // next/image + clip reveal + parallax
<Marquee speed={40} pauseOnHover>items</Marquee>
<Magnetic strength={0.3}>child</Magnetic>

// sections
<PageHero crumb={[{label,href}]} overline="…" title="…" sub="…" primary={{label,href}} secondary={{label,href}} aside={<ReactNode/>} image?={{src,alt}} />
<SectionHeader overline="…" title="…" intro?="…" tone="light"|"dark" align="split"|"stack" />
<ProofStrip items={[{k:"2008",v:"First private IIG licence"}]} tone="dark"|"light" />
<CTABand title="…" body?="…" primary={{label,href}} secondary?={{label,href}} />
<FAQ items={[{q,a}]} title?="Questions we hear most." />
<StatusPill label="ALL SYSTEMS OPERATIONAL" />
```

## 5. Motion system: "The Backbone"

Signature idea: **data moving along a backbone.** Motion is calm, engineered and precise. Never bouncy or gimmicky.

- **Smooth scroll:** Lenis (`lerp ≈ 0.1`, `smoothWheel: true`, touch native), synced with `gsap.ticker` and `ScrollTrigger.update`. Disable smoothing when `prefers-reduced-motion`.
- **Easing:** `power3.out` / `expo.out` for reveals (0.8–1.2s), `power2.inOut` for scrubbed timelines, micro-interactions 0.2–0.3s. Stagger 0.04–0.08.
- **Register plugins once** in `components/motion/gsap.ts`; use `useGSAP` with scope refs; use `gsap.matchMedia()` to branch desktop / mobile / reduced-motion.
- **Signature moments** (use them across the site, but don't overuse):
  1. **Preloader** (first visit per session, ≤1.4s): mango mark, mono counter 000→100, then a yellow Signal Line wipes open the page. Skippable and never blocks LCP content for long.
  2. **Headlines:** SplitText line-mask rise on enter.
  3. **Signal Line:** section dividers/timelines with a travelling yellow dot tied to scroll.
  4. **Counters:** proof numbers tick up (2008, 4, 7+, 24/7).
  5. **Pinned storytelling:** Home "Connect → Host → Secure → Manage" layers pinned with scrubbed transitions; Milestones as a horizontal scroll-driven timeline on desktop (vertical on mobile).
  6. **Image reveals:** clip-path inset reveal + subtle parallax.
  7. **Magnetic primary CTAs** (pointer: fine only).
  8. **Logo marquee** for clients/partners, grayscale → color on hover.
  9. **Hero WebGL globe** (Home + Network): Bangladesh glowing, mango signal arcs to the world, scroll-linked rotation.
- **Header:** transparent over dark heroes, becomes solid ink with blur after scroll; hides on scroll down and shows on scroll up. Mega-menu opens with staggered columns.
- **Page transition:** `template.tsx` with a quick ink/yellow wipe or content fade-rise (≤0.6s).
- Mobile: keep reveals, drop pinning and heavy scrubs, keep WebGL light (lower dpr, fewer points) or show the static image fallback.
- Always: `will-change` only during animation, transforms/opacity only, no layout thrash, clean up ScrollTriggers on unmount.

## 6. Content rules
- Use copy from `../Website Content/*.md`. No lorem ipsum, ever.
- Wrap every `[VERIFY]` item or unconfirmed number in `<Verify>`, or render its placeholder text neutrally. Never invent SLAs, latency, ASN or PoPs.
- Real contacts: Police Plaza Concord, Tower-02 (7th Floor), Plot 02, Road 144, Gulshan-1, Dhaka-1212 · +880 1730 068810 · +880 1730 068811 · contact@mango.com.bd · cloud@mango.com.bd.
- Every page: `export const metadata` (or `generateMetadata`) with title/description from the SEO sheet in `04-…md`. Title template: `%s | Mango Teleservices`.
- Semantic HTML, one `h1` per page, alt text on all images, `lang="en"`, visible focus rings (`outline-2 outline-offset-2` in signal blue `#2F6FEB` or mango on dark).

## 7. Routes (37 pages)

```
/                                   Home                                   [foundation]
/solutions                          Solutions hub                          [solutions]
/solutions/[slug]                   ip-transit, international-circuits, enterprise-internet, data-connectivity,
                                    data-centre, cloud, digital-trust, managed-services, software, training   [solutions]
/network                            Network                                [company]
/company/about | /company/leadership | /company/milestones | /company/partners | /company/newsroom   [company]
/group                              Mango Group                            [company]
/industries                         Industries hub                         [industries]
/industries/[slug]                  isps-operators, banking-finance, government, enterprise, education, digital-business [industries]
/resources/insights                 Insights hub                           [resources]
/resources/insights/[slug]          Article (seed 1–3 articles)            [resources]
/resources/case-studies             Case studies                           [resources]
/resources/case-studies/[slug]      Case study detail (nbr-training)       [resources]
/resources/faq                      FAQ hub                                [resources]
/careers | /careers/[slug]          Careers, Job detail (3 sample roles)   [conversion]
/support                            Support                                [conversion]
/contact | /contact/thank-you       Contact & RFP (multi-step, client-side validation), Thank you [conversion]
/legal/privacy                      Privacy policy                         [conversion]
not-found.tsx                       404                                    [conversion]
```

Nav links in `content/site.ts` must point to these routes.

## 8. File ownership (parallel agents: stay in your lane)

| Owner | Owns |
|---|---|
| **foundation** | `app/layout.tsx`, `app/template.tsx`, `app/page.tsx`, `app/globals.css`, `components/layout|motion|ui|sections/**`, `content/site.ts`, `components/home/**`, `lib/**` |
| **globe** | `components/three/**`, `public/data/**`, any geo build script under `scripts/` |
| **solutions** | `app/solutions/**`, `components/solutions/**`, `content/solutions.ts` |
| **company** | `app/network/**`, `app/company/**`, `app/group/**`, `components/company/**`, `content/company.ts` |
| **industries** | `app/industries/**`, `components/industries/**`, `content/industries.ts` |
| **resources** | `app/resources/**`, `components/resources/**`, `content/resources.ts` |
| **conversion** | `app/careers/**`, `app/support/**`, `app/contact/**`, `app/legal/**`, `app/not-found.tsx`, `components/conversion/**`, `content/careers.ts` |

If you find a bug in a file you don't own, do not edit it. Report it in your final summary with file and line.

## 9. Definition of done (every agent)

**Parallel-safety rules (several agents work in this folder at once):**
- **Do NOT run `npm run build` or `next dev` yourself.** Two Next processes in one folder corrupt `.next`. A shared dev server is already running at **http://localhost:3000** with hot reload; use it.
- Type-check with `npx tsc --noEmit -p .` and read only errors in your own files (others may be mid-edit). Lint your files: `npx eslint src/app/<your-area> src/components/<your-area>`.
- If localhost:3000 is down, report it in your summary; don't start another server on the same folder.
- The orchestrator runs the final `npm run build`.

1. `npx tsc --noEmit` shows zero errors in your files; eslint shows no errors in your files.
2. Screenshot your routes from the shared server at 1440×900 and 390×844 (full page) with headless Chrome, then **look at the screenshots** and fix layout issues. Append `?static=1` to disable the preloader and reveal animations (the foundation implements this) so content is visible in screenshots.
   `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$env:TEMP\chrome-mango" --window-size=1440,900 --virtual-time-budget=8000 --screenshot="<out.png>" http://localhost:<port>/<route>`
   (For full pages use a tall window, e.g. 1440×6000. Motion triggered by scroll may need `?static=1` or reduced-motion handling so content is visible in screenshots; the foundation must ensure content is never invisible if JS/animation fails.)
3. Compare against the matching `design-reference/*.png`.
4. No console errors, no hydration warnings, no layout shift from fonts/images.
5. Do not create git commits. Do not delete or overwrite other agents' files.
6. Final summary: what you built (routes and components), decisions, known gaps, and bugs spotted outside your lane.
