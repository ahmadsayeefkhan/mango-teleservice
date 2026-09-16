# Deploying to Hostinger

This is a **Next.js app**, not plain HTML. 51 of its 53 routes are prerendered static pages, but two things need a Node.js server:

- `/contact` — the quote form is a **Server Action** (server-side validation) and the page reads `?intent=quote&service=…`
- `next.config.ts` — the 28 permanent redirects from the old `/front/*` and `/cloud/*` URLs

I verified this: with `output: "export"` the build stops with *"Server Actions are not supported with static export"* and warns that redirects won't work.

So pick the path that matches your plan.

---

## Which plan do I have?

Log in to **hpanel.hostinger.com**:

| What you see | Plan | Path |
|---|---|---|
| A **VPS** tab with your server listed | VPS / Cloud VPS | **Path A** |
| **Hosting → your domain → Advanced → Node.js** exists | Node-capable hosting | **Path A** (adapted; no root, use the Node.js app UI) |
| Only **Websites / File Manager / Databases**, no Node.js entry | Shared web hosting (Premium / Business — PHP only) | **Path B** |

If unsure, check **Hosting → Manage → Plan details**, or ask Hostinger support: *"Can I run a Node.js 20+ application on this plan?"*

---

## Path A: VPS or Cloud (recommended — everything works)

Requirements: Ubuntu VPS, root/SSH access, your domain pointed at the VPS IP (hPanel → Domains → DNS → A record → VPS IP).

### 1. Prepare the server (once)

```bash
ssh root@YOUR_VPS_IP
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -   # Node 22 LTS
apt install -y nodejs nginx git
npm i -g pm2
```

### 2. Get the code onto the server

Option 1 — push this folder to a private GitHub repo, then on the server:
```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/<you>/<repo>.git mango
cd mango/website
```

Option 2 — upload directly from this PC (PowerShell), excluding build artifacts:
```powershell
cd "C:\Users\asufi\Desktop\Mango Teleservice"
tar --exclude=node_modules --exclude=.next --exclude=shots --exclude=design-reference -czf mango-site.tar.gz website
scp mango-site.tar.gz root@YOUR_VPS_IP:/var/www/
# then on the server:
# cd /var/www && tar -xzf mango-site.tar.gz && cd website
```

### 3. Build and run

```bash
npm ci
npm run build
pm2 start npm --name mango -- start        # runs `next start` on port 3000
pm2 save && pm2 startup                    # restart automatically after reboot
```

### 4. Put Nginx in front

`/etc/nginx/sites-available/mango`:
```nginx
server {
    listen 80;
    server_name mango.com.bd www.mango.com.bd;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # long cache for immutable build assets
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```
```bash
ln -s /etc/nginx/sites-available/mango /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### 5. Free HTTPS

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d mango.com.bd -d www.mango.com.bd
```

### 6. Deploying updates later

```bash
cd /var/www/mango/website && git pull && npm ci && npm run build && pm2 reload mango
```

---

## Path B: Shared web hosting (static export)

Works, but three changes are needed first — **ask me to do these**, they are not done yet:

1. **Quote form** — replace the Server Action with a client-side POST to a form service (Formspree, Web3Forms, or Hostinger's own form handling). Server-side validation is lost; client-side validation stays.
2. **`/contact?intent=quote`** — read the query string on the client instead of the server.
3. **`next.config.ts`** — add `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`, and move the 28 redirects into `.htaccess`.

Then:

```bash
npm run build          # writes ./out
```

Upload the **contents of `out/`** into `public_html` (hPanel → File Manager, or FTP). Add `public_html/.htaccess`:

```apache
RewriteEngine On

# legacy URLs → new pages (301)
RewriteRule ^front/bandwidth/?$ /solutions/ip-transit/ [R=301,L]
RewriteRule ^front/iplc/?$ /solutions/international-circuits/ [R=301,L]
RewriteRule ^front/infrastructure/?$ /solutions/data-centre/ [R=301,L]
RewriteRule ^front/digital-signature/?$ /solutions/digital-trust/ [R=301,L]
RewriteRule ^front/manage-services/?$ /solutions/managed-services/ [R=301,L]
RewriteRule ^front/software/?$ /solutions/software/ [R=301,L]
RewriteRule ^front/training/?$ /solutions/training/ [R=301,L]
RewriteRule ^mango-cloud/?$ /solutions/cloud/ [R=301,L]
RewriteRule ^cloud/(about|features|product)/?$ /solutions/cloud/ [R=301,L]
RewriteRule ^cloud/price/?$ /solutions/cloud/#pricing [R=301,L]
RewriteRule ^cloud/contact/?$ /contact/ [R=301,L]
RewriteRule ^front/(bod|management-team)/?$ /company/leadership/ [R=301,L]
RewriteRule ^front/mission-vision/?$ /company/about/ [R=301,L]
RewriteRule ^front/history/?$ /company/milestones/ [R=301,L]
RewriteRule ^front/partners/?$ /company/partners/ [R=301,L]
RewriteRule ^front/(projects|purple|platinum|electric-vehicle|solar|mango-lithium|motor-accessories|school)/?$ /group/ [R=301,L]
RewriteRule ^front/career/?$ /careers/ [R=301,L]
RewriteRule ^front/contact/?$ /contact/ [R=301,L]

ErrorDocument 404 /404.html

# cache build assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

Enable free SSL in hPanel → **Security → SSL**, and force HTTPS.

**Cost of this path:** images are served unoptimized (larger downloads, so mobile scores drop a few points), the form has no server-side validation, and future dynamic features (search, live status, a CMS) would need a move to Path A.

---

## Either way, before going live

- Set the real domain in `src/lib/seo.ts` (`SITE_URL`) so metadata and JSON-LD use absolute URLs.
- Confirm every `<Verify>` item (`NEXT_PUBLIC_SHOW_VERIFY=1 npm run dev` shows them).
- Point the form to a real inbox (`src/app/contact/actions.ts` has a TODO).
- Check `robots.txt` / sitemap (not generated yet — ask me to add `next-sitemap` or a route handler).
- In hPanel → Domains → DNS, keep TTL low for the first day in case you need to roll back.

**Note:** Hostinger shared hosting is PHP-first; Next.js apps are a better fit on their VPS/Cloud tiers. Alternatively, Vercel (the Next.js maker) has a free tier that deploys this repo as-is in minutes, and you can keep your domain at Hostinger by pointing DNS to Vercel.
