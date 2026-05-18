# Deploy Guide — AEGIS Creator Toolkit

Time to first revenue: **~15 minutes**

---

## Prerequisites

- Vercel account (free) — vercel.com
- Gumroad account (free) — gumroad.com
- DashScope key — dashscope.aliyuncs.com (free tier works)
- This repo pushed to GitHub (`claude/aegis-setup-Lx7Ji` branch or merged to main)

---

## Step 1 — Get a DashScope API key

1. Go to [dashscope.aliyuncs.com](https://dashscope.aliyuncs.com) → sign up
2. Dashboard → API Keys → Create API Key
3. Copy the key (starts with `sk-`)
4. Keep it — you'll need it for every Vercel project

---

## Step 2 — Deploy Platform Picker

1. Go to [vercel.com/new](https://vercel.com/new) → Import Git Repository → `tarikskalic33/myapp`
2. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `platform-picker`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
3. Environment Variables → Add:
   ```
   VITE_DASHSCOPE_API_KEY = sk-your-key-here
   ```
4. Deploy → copy the URL (e.g. `platform-picker-xxx.vercel.app`)

---

## Step 3 — Deploy Hook Generator

Same as Step 2 but **Root Directory**: `hook-generator`

→ Copy URL (e.g. `hook-generator-xxx.vercel.app`)

---

## Step 4 — Deploy Content Calendar

Same as Step 2 but **Root Directory**: `content-calendar`

→ Copy URL (e.g. `content-calendar-xxx.vercel.app`)

---

## Step 5 — Deploy Hub (landing page)

Same as Step 2 but **Root Directory**: `hub`

No environment variables needed.

After deploy, update `hub/src/App.tsx` — replace `gumroadUrl` values with your real Gumroad links (see Step 7), then redeploy.

---

## Step 6 — Deploy Cockpit (optional — governance dashboard)

Same as Step 2 but **Root Directory**: `cockpit`

Environment Variables:
```
VITE_DASHSCOPE_API_KEY = sk-your-key-here
VITE_BRIDGE_URL        = http://localhost:7890   (or your ECS IP if running Python bridge)
```

---

## Step 7 — Create Gumroad Listings

See `docs/GUMROAD_LISTINGS.md` for ready-to-paste titles and descriptions.

**For each product:**
1. gumroad.com → Products → New Product → Digital product
2. Upload the zip from `~/aegis/` (platform-picker.zip, hook-generator.zip, content-calendar.zip)
3. Set price: $19
4. Paste the listing title and description from `docs/GUMROAD_LISTINGS.md`
5. Publish → copy the product URL (e.g. `gumroad.com/l/platform-picker`)

**Update URLs in the hub:**

Edit `hub/src/App.tsx` — find the `PRODUCTS` array and update each `gumroadUrl`:
```typescript
gumroadUrl: 'https://tarikskalic.gumroad.com/l/platform-picker',
```

Edit `hub/src/components/PricingTable.tsx` — update the `gumroadUrl` in each tier.

Rebuild hub (`npm run build`) and redeploy to Vercel.

---

## Step 8 — Bundle listings (optional — $29 / $39)

In Gumroad → Products → New Product → Bundle:
- **Starter Pack** ($29): any two products
- **Full Toolkit** ($39): all three products

---

## Zips for Gumroad upload

Already generated at `~/aegis/`:
```
~/aegis/platform-picker.zip   (128 KB)
~/aegis/hook-generator.zip    (127 KB)
~/aegis/content-calendar.zip  (125 KB)
```

Regenerate after any changes:
```bash
cd /home/user/myapp
zip -r ~/aegis/platform-picker.zip platform-picker/ --exclude "*/node_modules/*" --exclude "*/dist/*" --exclude "*/.env"
zip -r ~/aegis/hook-generator.zip hook-generator/ --exclude "*/node_modules/*" --exclude "*/dist/*" --exclude "*/.env"
zip -r ~/aegis/content-calendar.zip content-calendar/ --exclude "*/node_modules/*" --exclude "*/dist/*" --exclude "*/.env"
```

---

## After deployment — update these files

| File | What to update |
|------|----------------|
| `hub/src/App.tsx` | `gumroadUrl` in PRODUCTS array |
| `hub/src/components/PricingTable.tsx` | `gumroadUrl` in TIERS array |
| `platform-picker/src/components/ToolkitFooter.tsx` | Cross-product URLs |
| `hook-generator/src/components/ToolkitFooter.tsx` | Cross-product URLs |
| `content-calendar/src/components/ToolkitFooter.tsx` | Cross-product URLs |
| `docs/architecture.md` | Vercel URLs in Products table |

---

## Revenue model

| Product | Price | Your cut (Gumroad fee ~10%) |
|---------|-------|---------------------------|
| Platform Picker | $19 | ~$17 |
| Hook Generator | $19 | ~$17 |
| Content Calendar | $19 | ~$17 |
| Starter Pack (any 2) | $29 | ~$26 |
| Full Toolkit (all 3) | $39 | ~$35 |

API costs: DashScope free tier = 1M tokens/month. Each product call uses ~500–1500 tokens.
At paid tier: ~$0.001 per run. Your margin is effectively 99%.
