# AEGIS Ω — Deployment Guide

## Commercial Products — 4 Vercel projects needed

Go to vercel.com/new for each. All builds verified clean on branch claude/aegis-setup-Lx7Ji.

### Steps (same for all 4):
1. Import → tarikskalic33/myapp
2. Root Directory → set to folder name below
3. Add env var: VITE_DASHSCOPE_API_KEY=LTAI5tCeUz1QrPd6mk8N7nN8
4. Add env var: VITE_DASHSCOPE_MODEL=qwen-plus
5. Deploy

### platform-picker  →  Root Directory: platform-picker
### hook-generator   →  Root Directory: hook-generator
### content-calendar →  Root Directory: content-calendar
### hub              →  Root Directory: hub

## Sovereign Omega Runtime
Project: myapp (already linked)
Trigger redeploy from branch claude/aegis-setup-Lx7Ji in Vercel dashboard.

## Studio + Cockpit
vercel --prod from studio/ and cockpit/ directories.
Requires VITE_BRIDGE_URL pointing to hosted bridge.py.

## Gumroad Pricing
Platform Picker: $19 | Hook Generator: $19 | Content Calendar: $19
Any 2: $29 | All 3: $39
