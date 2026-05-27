# AEGIS Ω — Deployment Guide

**Status:** All products build clean. Vercel deployment requires your local machine.
**Branch:** `claude/aegis-setup-Lx7Ji`

---

## Option A — One-Command Deploy (from your local machine)

```bash
# 1. Clone / pull the repo on your local machine
git pull origin claude/aegis-setup-Lx7Ji

# 2. Install Vercel CLI and log in
npm i -g vercel
vercel login    # opens browser to authenticate

# 3. Set your DashScope API key (get from dashscope.aliyun.com → API Keys)
export DASHSCOPE_KEY="sk-XXXXXXXXXXXXXXXX"

# 4. Deploy everything
bash scripts/deploy-products.sh
```

Done. Script deploys all 4 products and prints the URLs.

---

## Option B — Manual Vercel Dashboard

Go to **vercel.com/new** → Import Git Repository → `tarikskalic33/AEGIS--`

Create 4 separate projects:

| Project name | Root Directory | Environment Variables |
|---|---|---|
| `aegis-hub` | `hub` | *(none needed)* |
| `aegis-platform-picker` | `platform-picker` | `VITE_DASHSCOPE_API_KEY=sk-...` + `VITE_DASHSCOPE_MODEL=qwen-plus` |
| `aegis-hook-generator` | `hook-generator` | `VITE_DASHSCOPE_API_KEY=sk-...` + `VITE_DASHSCOPE_MODEL=qwen-plus` |
| `aegis-content-calendar` | `content-calendar` | `VITE_DASHSCOPE_API_KEY=sk-...` + `VITE_DASHSCOPE_MODEL=qwen-plus` |

For each project: **Framework Preset = Vite**, **Install Command = npm install**, **Build Command = npm run build**, **Output Directory = dist**

---

## Step 2 — Set Up Gumroad Products

Go to **gumroad.com** → Products → New Product for each:

| Product | Permalink (EXACT — must match) | Price |
|---|---|---|
| Platform Picker | `aegis-platform-picker` | $19 |
| Hook Generator | `aegis-hook-generator` | $19 |
| Content Calendar | `aegis-content-calendar` | $19 |
| Full Toolkit (bundle) | `aegis-full-toolkit` | $39 |

The `api/verify-license.ts` in each product hits `https://api.gumroad.com/v2/licenses/verify` with these exact permalinks. **They must match exactly.**

---

## Step 3 — Update Hub with Product URLs

After deploying, update `hub/src/App.tsx` to link directly to each product's Vercel URL (the deployed URL, not the Gumroad URL — the Gumroad links already point to the right places).

---

## What Each Product Does

| Product | Features | Tech |
|---|---|---|
| **Platform Picker** | Scores TikTok/YT Shorts/IG Reels/Snapchat for your niche + goals | DashScope/Qwen AI, radar chart, one-click share |
| **Hook Generator** | 10 viral hooks ranked by viral potential | DashScope/Qwen AI, type-coded badges, export |
| **Content Calendar** | 4-week content calendar with daily hooks | DashScope/Qwen AI, CSV/TXT export |
| **Hub** | Landing page for all 3 products + enterprise | Static React, PostHog analytics |

---

## DashScope API Key

Get from: **dashscope.aliyun.com** → Console → API Keys → Create API Key
Format: `sk-XXXXXXXXXXXXXXXX` (starts with `sk-`)
Cost: ~$0.001–0.003 per AI call (very cheap, Qwen models)
Set `VITE_DASHSCOPE_MODEL=qwen-plus` (default model, fast + capable)

---

## Pricing
- Platform Picker: **$19**
- Hook Generator: **$19**  
- Content Calendar: **$19**
- Any 2: **$29** | All 3 (Full Creator AI Toolkit): **$39**
