# Deploying to Vercel

Vercel is made by the Next.js team, so this project deploys **with no code changes**: server actions, image optimization, the 28 legacy redirects, sitemap and robots.txt all work as built.

Everything below is done from `C:\Users\asufi\Desktop\Mango Teleservice\website`.

---

## Option 1 — CLI (fastest, no GitHub account needed)

```powershell
cd "C:\Users\asufi\Desktop\Mango Teleservice\website"
npx vercel login        # opens the browser; sign in with email/GitHub/Google
npx vercel              # preview deploy — answer the prompts (see below)
npx vercel --prod       # production deploy
```

Prompt answers:

| Prompt | Answer |
|---|---|
| Set up and deploy? | **Y** |
| Which scope? | your personal account |
| Link to existing project? | **N** |
| Project name | `mango-teleservices` |
| In which directory is your code? | `./` (you're already in `website/`) |
| Auto-detected settings (Next.js)? | **Y** — don't override the build command |

You get a URL like `https://mango-teleservices.vercel.app` immediately.

**Note:** these commands need you to type answers, so run them yourself in this terminal by prefixing with `!`, e.g. `! npx vercel login`. I can't complete an interactive login for you.

---

## Option 2 — GitHub (recommended for ongoing work)

Every push then deploys automatically, with a preview URL per branch.

```powershell
cd "C:\Users\asufi\Desktop\Mango Teleservice\website"
git init
git add .
git commit -m "Mango Teleservices website"
gh repo create mango-teleservices --private --source=. --push    # needs GitHub CLI + `gh auth login`
```
(or create an empty repo on github.com and follow its "push an existing repository" commands)

Then at **vercel.com/new** → *Import Git Repository* → pick the repo → **Deploy**. Leave the framework preset on Next.js and the root directory as the repo root.

---

## Required environment variable

In Vercel → **Project → Settings → Environment Variables**, add:

| Name | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.mango.com.bd` (or your live URL) | Production |

Without it, canonical URLs, Open Graph tags, JSON-LD and the sitemap fall back to `https://www.mango.com.bd`. On a preview deploy you can leave it unset or point it at the `.vercel.app` URL.

Optional: `NEXT_PUBLIC_SHOW_VERIFY=1` on a *preview* deployment gives the client a link where every unconfirmed claim is visibly badged — useful for the sign-off round. Never set it in production.

---

## Connecting the mango.com.bd domain (kept at Hostinger)

1. Vercel → Project → **Settings → Domains** → add `mango.com.bd` and `www.mango.com.bd`.
2. Vercel shows the DNS records to create. In **hPanel → Domains → DNS Zone**:
   - `A` record, host `@` → `76.76.21.21`
   - `CNAME`, host `www` → `cname.vercel-dns.com`
   (use whatever values Vercel displays — they're authoritative)
3. Delete conflicting old `A`/`CNAME` records for `@` and `www` that point at Hostinger hosting.
4. Wait for propagation (usually minutes, up to 24h). Vercel issues the SSL certificate automatically.
5. Keep email/MX records untouched — they stay with your current mail provider.

Roll-back safety: lower the DNS TTL to 5 minutes a day before the switch, so you can revert quickly.

---

## After the first deploy

- Check the live URLs: `/`, `/contact` (submit the quote form once), `/solutions/cloud` (estimator), `/network` (WebGL globe), `/sitemap.xml`, `/robots.txt`, a legacy redirect such as `/front/bandwidth`.
- Submit `https://<domain>/sitemap.xml` in Google Search Console, and use the URL Inspection tool on the old `/front/*` URLs to confirm the 301s.
- Connect the quote form to a real inbox — `src/app/contact/actions.ts` currently logs and redirects (TODO marked). On Vercel, Resend or Nodemailer + SMTP are both straightforward; add the API key as an environment variable.
- Vercel Analytics / Speed Insights can be enabled in one click if you want real-user performance data.

## Cost

The Hobby (free) plan covers this site: static pages are served from the CDN, and only `/contact` runs server-side. If the site is commercially operated, Vercel's terms expect a Pro plan ($20/month per member) — worth checking against their current policy at signup.
