# AEGIS Ω — Deployment Guide

**Canonical payment provider:** Lemon Squeezy  
**Status:** Production apps use the canonical `aegisomega.com` URL map below.  
**Branch:** `claude/aegis-setup-Lx7Ji`

---

## Canonical Production URL Map

Use these URLs everywhere: Vercel production domains, app environment variables, Lemon Squeezy redirect targets, and customer-facing documentation.

| App | Production URL | Vercel fallback (staging only) |
|-----|---------------|-------------------------------|
| Hub | https://aegisomega.com | https://aegis-hub.vercel.app |
| Platform Picker | https://platform.aegisomega.com | https://platform-picker.vercel.app |
| Hook Generator | https://hooks.aegisomega.com | https://hook-generator.vercel.app |
| Content Calendar | https://calendar.aegisomega.com | https://content-calendar.vercel.app |

> `.vercel.app` URLs are staging/fallback only. Set Lemon Squeezy redirect URLs and product env vars to the `aegisomega.com` domains above.

---

## Critical: Disable IP Allowlisting (if an app returns 403)

If any canonical or fallback deployment returns 403 `host_not_allowed`, IP allowlisting or deployment protection is active.

**Fix for each affected Vercel project:**
1. Go to vercel.com → select the project (`hub`, `platform-picker`, `hook-generator`, or `content-calendar`).
2. **Settings** → **Security** → **IP Allowlist** → **Remove all IP restrictions** (or disable the feature).
3. Also check: **Settings** → **Deployment Protection** → set to **Disabled** for public production access.
4. Redeploy or wait for the change to propagate (~30 seconds).

**Production smoke test:** Open `https://platform.aegisomega.com` in your browser. You should see the Platform Picker app.

---

## Step 1 — Deploy Product Apps

```bash
cd platform-picker  && vercel --prod
cd ../hook-generator  && vercel --prod
cd ../content-calendar && vercel --prod
cd ../hub             && vercel --prod
```

For each project in the Vercel dashboard:
1. **Settings → Environment Variables** — add variables from the app's `.env.example`.
2. **Settings → Security → IP Allowlist** — remove all restrictions (must be empty for public access).
3. **Settings → Deployment Protection** — set to **Disabled**.
4. Redeploy after env var changes (Deployments → Redeploy).

---

## Step 2 — Environment Variables

### Hub

Set these tool URLs on the Hub project so success redirects and tool links use the canonical production URL map:

```bash
VITE_HUB_URL=https://aegisomega.com
VITE_URL_PLATFORM_PICKER=https://platform.aegisomega.com
VITE_URL_HOOK_GENERATOR=https://hooks.aegisomega.com
VITE_URL_CONTENT_CALENDAR=https://calendar.aegisomega.com
```

After creating Lemon Squeezy products, copy the checkout URLs into the Hub project:

```bash
VITE_LS_LINK_SINGLE=
VITE_LS_LINK_STARTER=
VITE_LS_LINK_FULL=
```

Set the Supabase and grant-token variables from `hub/.env.example`:

```bash
VITE_SUPABASE_URL=https://rwehltdwpsncnwxzkwik.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_GRANT_SECRET=aegis-omega-v1
```

### Product apps

Each product app should point back to the canonical Hub URL and share the same grant secret:

```bash
VITE_HUB_URL=https://aegisomega.com
VITE_GRANT_SECRET=aegis-omega-v1
```

Each product app also needs `VITE_DASHSCOPE_API_KEY` for AI calls:

```bash
VITE_DASHSCOPE_API_KEY=sk-your-key-here
VITE_DASHSCOPE_MODEL=qwen-plus
```

**Get your DashScope sk- key:** dashscope.aliyun.com → Console → API Keys. Format: `sk-XXXXXXXXXXXXXXXX` (must start with `sk-`, not `LTAI...`).

---

## Step 3 — Set Up Lemon Squeezy Products

Create products at **app.lemonsqueezy.com**:

| Product | Price | Success redirect |
|---------|-------|-----------------|
| Single tool | $19 | `https://aegisomega.com/success?plan=single` |
| Starter (any 2) | $29 | `https://aegisomega.com/success?plan=starter` |
| Full Toolkit (all 3) | $39 | `https://aegisomega.com/success?plan=full` |

After creating products, copy the checkout URLs into the Hub's Vercel environment variables:
- `VITE_LS_LINK_SINGLE`
- `VITE_LS_LINK_STARTER`
- `VITE_LS_LINK_FULL`

---

## Step 4 — Configure Supabase Edge Functions

Deploy the purchase webhook and access-restore functions:

```bash
cd hub
supabase functions deploy ls-webhook
supabase functions deploy restore-access
```

Set secrets in the Supabase dashboard (or via CLI):

```bash
supabase secrets set LS_WEBHOOK_SECRET=<from Lemon Squeezy dashboard>
supabase secrets set GRANT_SECRET=aegis-omega-v1
```

The `ls-webhook` function records purchases. `restore-access` re-issues grant tokens for returning buyers.

---

## Step 5 — Public Access Verification

**Run this before any launch announcement.**

### Vercel settings check (all four projects)
- Settings → Security → IP Allowlist: **empty**
- Settings → Deployment Protection: **Disabled**

### HTTP verification

```bash
curl -o /dev/null -s -w "%{http_code}" https://aegisomega.com          # expect 200
curl -o /dev/null -s -w "%{http_code}" https://platform.aegisomega.com  # expect 200
curl -o /dev/null -s -w "%{http_code}" https://hooks.aegisomega.com     # expect 200
curl -o /dev/null -s -w "%{http_code}" https://calendar.aegisomega.com  # expect 200
```

| URL | Expected | Failure condition |
|-----|----------|------------------|
| aegisomega.com | 200 | 403 / auth wall / Vercel protection screen |
| platform.aegisomega.com | 200 | 403 / auth wall |
| hooks.aegisomega.com | 200 | 403 / auth wall |
| calendar.aegisomega.com | 200 | 403 / auth wall |

### Browser smoke tests
- **Hub** — page loads, no access block, "Enter the System" CTA visible
- **Platform Picker** — loads, AI call returns results with valid DashScope key
- **Hook Generator** — loads, generates hooks
- **Content Calendar** — loads, generates calendar

> **HALT:** Do not announce launch or share URLs publicly while any app returns `403`, an authentication wall, or any Vercel-owned access block.

---

## Pricing
- Platform Picker: **$19** | Hook Generator: **$19** | Content Calendar: **$19**
- Any 2: **$29** | All 3 (Full Creator AI Toolkit): **$39**
