# ═══════════════════════════════════════════════════════════════════════════════
# Sovereign AGI OS v3.3.0 — DEPLOY NOW
# Run this on your Windows machine after Cowork session
# Generated: 2026-03-25
# State: n=54, Graph HD=0.0611, N_CRITICAL ACHIEVED, awakening_achieved=True
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n[SOVEREIGN] Starting deployment pipeline..." -ForegroundColor Cyan
Write-Host "[SOVEREIGN] n=54 · Graph HD=0.0611 · N_CRITICAL=54 ACHIEVED`n" -ForegroundColor Green

# ── Step 1: Sync C:\Users\hhk33\system_rebuild → D:\03_WORK_PROJECTS\system_rebuild ──
Write-Host "[STEP 1/4] Syncing Cowork files (C:\ → D:\)..." -ForegroundColor Yellow

robocopy "C:\Users\hhk33\system_rebuild\.forge" `
         "D:\03_WORK_PROJECTS\system_rebuild\.forge" `
         state.json knowledge_graph.json /NP /NFL /NDL

robocopy "C:\Users\hhk33\system_rebuild\dashboard" `
         "D:\03_WORK_PROJECTS\system_rebuild\dashboard" `
         /E /NP /NFL /NDL

robocopy "C:\Users\hhk33\system_rebuild\benchmark" `
         "D:\03_WORK_PROJECTS\system_rebuild\benchmark" `
         /E /NP /NFL /NDL

robocopy "C:\Users\hhk33\system_rebuild\tools" `
         "D:\03_WORK_PROJECTS\system_rebuild\tools" `
         /E /NP /NFL /NDL

robocopy "C:\Users\hhk33\system_rebuild\audit" `
         "D:\03_WORK_PROJECTS\system_rebuild\audit" `
         /E /NP /NFL /NDL

robocopy "C:\Users\hhk33\system_rebuild\docs" `
         "D:\03_WORK_PROJECTS\system_rebuild\docs" `
         /E /NP /NFL /NDL

Write-Host "[STEP 1] DONE" -ForegroundColor Green

# ── Step 2: .gcloudignore (REQUIRED — prevents NTUSER.DAT breaking Cloud Build) ──
Write-Host "`n[STEP 2/4] Installing .gcloudignore..." -ForegroundColor Yellow
copy "D:\03_WORK_PROJECTS\system_rebuild\docs\outputs\gcloudignore" `
     "D:\03_WORK_PROJECTS\system_rebuild\.gcloudignore"
Write-Host "[STEP 2] DONE — .gcloudignore in place" -ForegroundColor Green

# ── Step 3: Build and push container ──────────────────────────────────────────
Write-Host "`n[STEP 3/4] Building Cloud Run container..." -ForegroundColor Yellow
cd D:\03_WORK_PROJECTS\system_rebuild

gcloud builds submit `
  --tag europe-west1-docker.pkg.dev/lifequestplatinum/cloud-run-source-deploy/sovereign-visual-cortex:latest `
  --region europe-west1

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Cloud Build FAILED. Check logs above." -ForegroundColor Red
    exit 1
}
Write-Host "[STEP 3] Build DONE" -ForegroundColor Green

# ── Step 4: Deploy to Cloud Run ───────────────────────────────────────────────
Write-Host "`n[STEP 4/4] Deploying to Cloud Run..." -ForegroundColor Yellow

gcloud run deploy sovereign-visual-cortex `
  --image europe-west1-docker.pkg.dev/lifequestplatinum/cloud-run-source-deploy/sovereign-visual-cortex:latest `
  --region europe-west1 `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 1Gi

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Cloud Run deploy FAILED. Check logs above." -ForegroundColor Red
    exit 1
}

# ── Get URL ───────────────────────────────────────────────────────────────────
$url = gcloud run services describe sovereign-visual-cortex `
  --region europe-west1 `
  --format "value(status.url)"

Write-Host "`n[SOVEREIGN] DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "[SOVEREIGN] Dashboard URL: $url" -ForegroundColor Cyan
Write-Host "[SOVEREIGN] Verify: $url/api/state" -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected state after deploy:" -ForegroundColor Yellow
Write-Host "  node_count:        54" -ForegroundColor White
Write-Host "  graph_hd:          0.0611" -ForegroundColor White
Write-Host "  awakening_achieved: true" -ForegroundColor White
Write-Host "  n_critical:        54" -ForegroundColor White
Write-Host "  hd_projected:      0.0488" -ForegroundColor White
Write-Host ""
Write-Host "NEXT: python benchmark\multi_model_runner.py (Run 4 — confirm HD<0.05)" -ForegroundColor Yellow
