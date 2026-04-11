# Sovereign OS — GDrive Auth Setup
# Adds Google Drive scope to Application Default Credentials
# Run this ONCE in a terminal, approve the browser popup, then run gdrive_sync.py

Write-Host "[AUTH] Adding Drive scope to gcloud ADC..." -ForegroundColor Cyan

& "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login `
    --scopes "https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/cloud-platform" `
    --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Drive auth complete. Running sync..." -ForegroundColor Green
    python "$PSScriptRoot\gdrive_sync.py"
} else {
    Write-Host "[ERROR] Auth failed. Check browser window." -ForegroundColor Red
}
