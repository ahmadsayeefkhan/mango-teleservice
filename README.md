# mango.com.bd: website rebuild

Production website for **Mango Teleservices Limited**: 37 designed pages (53 generated routes), built with Next.js 16, GSAP and Three.js.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (all pages prerendered except /contact)
npm start            # serve the production build
npm run lint
```

Useful query flags:
- `?static=1` turns off the preloader and all animation (also automatic under `prefers-reduced-motion`).
- `NEXT_PUBLIC_SHOW_VERIFY=1 npm run dev` shows dashed badges on every claim still awaiting client confirmation (`<Verify>`).

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript |
| Styling | Tailwind CSS 4.3; brand tokens in `src/app/globals.css` (`@theme`) |
| Motion | GSAP 3.15 (ScrollTrigger, SplitText, MotionPath) + Lenis smooth scroll |
| 3D | three r186 + @react-three/fiber 9 + drei + postprocessing (network globe) |
| Fonts | Sora (display), DM Sans (body), JetBrains Mono (data), Hind Siliguri (Bangla) via `next/font` |

## Structure

```
src/app/                      routes (home, solutions, network, company, group, industries, resources, careers, support, contact, legal)
src/components/ui/            Button, Overline, Section, Container, Tag, Verify, Icon
src/components/motion/        SmoothScroll, Reveal, SplitHeading, Counter, SignalLine, ParallaxImage, Marquee, Magnetic, Preloader
src/components/sections/      PageHero, SectionHeader, ProofStrip, CTABand, FAQ, StatusPill
src/components/layout/        UtilityBar, SiteHeader (mega-menu), MobileNav, SiteFooter, Breadcrumbs
src/components/three/         NetworkGlobe (+ globe/ scene, shaders, geo)
src/components/<area>/        page-specific components (home, solutions, company, industries, resources, conversion)
src/content/*.ts              ALL copy and page data (edit here to change text)
public/data/land-dots*.bin    precomputed globe land data (regenerate: node scripts/build-land-dots.mjs)
tools/                        shot.mjs (CDP screenshots), crawl.mjs (link checker), qa-all.ps1
design-reference/             approved Pen designs (PNG) used as the visual spec
```

Spec documents: `BUILD_BRIEF.md` (design system, motion, rules) and `FOUNDATION_API.md` (component API).

## Editing content

All page copy lives in typed data files in `src/content/`: `site.ts` (nav, footer, contacts), `solutions.ts`, `company.ts`, `industries.ts`, `resources.ts` (articles, case studies, FAQ), `careers.ts`, `legal.ts`, plus `src/components/home/home-data.ts`. Wrap any unconfirmed figure in `<Verify>`.

## Before launch (client inputs)

- Confirm every `<Verify>` item (run with `NEXT_PUBLIC_SHOW_VERIFY=1` to see them): SLAs, specs, cloud pricing, licence numbers, venture statuses, benefits, office hours, mangoca.com / cloud login URLs.
- Replace AI placeholder imagery with a real photoshoot (NOC, data centre, team, leadership).
- Client-logo usage permissions; real job vacancies; 2024–26 milestones and news.
- Connect the quote form's Server Action (`src/app/contact/actions.ts`) and the careers/newsletter forms to email or a CRM.
- Legal review of Privacy / Terms / Cookies.
- Set the production URL in `src/lib/seo.ts` (`SITE_URL`) and add 301 redirects from the old `/front/*` and `/cloud/*` URLs (list in the content-strategy skill §3).
