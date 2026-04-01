$dirs = @(
    'corpus/governance',
    'corpus/compliance',
    'corpus/agent_architecture',
    'corpus/commercialization',
    'corpus/lifequest',
    'corpus/infrastructure',
    'corpus/skills',
    'corpus/workflows',
    'processed/chunks',
    'processed/metadata',
    'processed/embeddings',
    'obsidian_vault/00_Index',
    'obsidian_vault/01_Core_Concepts',
    'obsidian_vault/02_System_Maps',
    'obsidian_vault/03_Playbooks',
    'obsidian_vault/04_Use_Cases',
    'obsidian_vault/05_Open_Questions'
)

foreach ($d in $dirs) {
    $path = "D:\ResearchOS\$d"
    Write-Host "Creating: $path"
    New-Item -ItemType Directory -Path $path -Force | Out-Null
}
