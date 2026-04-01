# SOVEREIGN AGI OS — Cloud Run Deployment Script
# Run from: D:\03_WORK_PROJECTS\system_rebuild
# Prerequisites: gcloud CLI authenticated, project = lifequestplatinum

$PROJECT   = "lifequestplatinum"
$SERVICE   = "sovereign-visual-cortex"
$REGION    = "europe-west1"
$IMAGE     = "gcr.io/$PROJECT/$SERVICE"

Write-Host "=== SOVEREIGN DEPLOY ===" -ForegroundColor Cyan
Write-Host "Project : $PROJECT"
Write-Host "Service : $SERVICE"
Write-Host "Region  : $REGION"
Write-Host ""

# Step 1: Ensure .gcloudignore is in project root (prevents NTUSER.DAT breaking build)
Write-Host "[1/4] Verifying .gcloudignore..." -ForegroundColor Yellow
if (-not (Test-Path ".gcloudignore")) {
    Write-Host "  .gcloudignore missing — creating from docs\outputs\gcloudignore" -ForegroundColor Red
    Copy-Item "docs\outputs\gcloudignore" ".gcloudignore"
} else {
    Write-Host "  .gcloudignore present ✓" -ForegroundColor Green
}

# Step 2: Submit build to Cloud Build
Write-Host ""
Write-Host "[2/4] Submitting build to Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --tag $IMAGE --project $PROJECT

if ($LASTEXITCODE -ne 0) {
    Write-Host "  BUILD FAILED (exit $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}
Write-Host "  Build succeeded ✓" -ForegroundColor Green

# Step 3: Deploy to Cloud Run
Write-Host ""
Write-Host "[3/4] Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE `
    --image $IMAGE `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --project $PROJECT

if ($LASTEXITCODE -ne 0) {
    Write-Host "  DEPLOY FAILED (exit $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}
Write-Host "  Deploy succeeded ✓" -ForegroundColor Green

# Step 4: Print live service URL
Write-Host ""
Write-Host "[4/4] Fetching service URL..." -ForegroundColor Yellow
$URL = gcloud run services describe $SERVICE --region $REGION --format "value(status.url)" --project $PROJECT
Write-Host ""
Write-Host "=== LIVE URL ===" -ForegroundColor Cyan
Write-Host $URL -ForegroundColor Green
Write-Host ""
Write-Host "Open the URL above, navigate to Self-Model panel, take screenshot -> docs\outputs\kaggle_cover_image.png"
