$vaultRoot = "D:\ResearchOS\obsidian_vault"

$folders = @(
    "00_Index",
    "01_Core_Concepts",
    "02_System_Maps",
    "03_Playbooks",
    "04_Use_Cases",
    "05_Open_Questions"
)

# Create folders if they don't exist
foreach ($f in $folders) {
    $path = Join-Path $vaultRoot $f
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

# Create Index note
$indexContent = @"
# Research Knowledge Engine Index

## Core Pillars
- [[01_Core_Concepts/SAGA_Governance|SAGA Governance]]
- [[01_Core_Concepts/SPSF_Persistence|SPSF Persistence]]
- [[01_Core_Concepts/Monetization_Wedges|Compliance Monetization]]
- [[02_System_Maps/Research_OS_Architecture|System Architecture]]

## Recent Activity
- [[00_Index/Latest_Findings|Latest Findings]]
"@

$indexPath = Join-Path $vaultRoot "00_Index\Master_Index.md"
if (-not (Test-Path $indexPath)) {
    $indexContent | Out-File -FilePath $indexPath -Encoding utf8
}

Write-Host "Obsidian vault initialized at $vaultRoot"
