$corpusRoot = "D:\ResearchOS\corpus"
$processedRoot = "D:\ResearchOS\processed"

# Ensure output directories exist
New-Item -ItemType Directory -Path "$processedRoot\metadata" -Force | Out-Null
New-Item -ItemType Directory -Path "$processedRoot\chunks" -Force | Out-Null

function Get-GoldmineScore {
    param([string]$text)
    $score = 50 # Base score
    
    # Heuristics
    $wordCount = ($text -split '\s+').Count
    if ($wordCount -gt 500) { $score += 10 }
    if ($wordCount -gt 1000) { $score += 10 }
    
    # Headers
    $headerCount = ([regex]::Matches($text, '^#', 'Multiline')).Count
    if ($headerCount -gt 5) { $score += 10 }
    
    # Keywords
    $keywords = @("sovereign", "persistence", "compliance", "monetization", "SAGA", "SPSF", "IAM")
    foreach ($k in $keywords) {
        if ($text -like "*$k*") { $score += 2 }
    }
    
    return [Math]::Min(100, $score)
}

function Process-MarkdownFile {
    param([string]$filePath)
    $content = Get-Content $filePath -Raw
    $fileName = Split-Path $filePath -Leaf
    $docId = [Guid]::NewGuid().ToString()
    
    # Extract Title (First # line or FileName)
    $titleMatch = [regex]::Match($content, '^#\s+(.*)$', 'Multiline')
    $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value.Trim() } else { $fileName }
    
    # Semantic Chunking by Headings
    # Split by any header level
    $chunks = $content -split '(?m)^(?=#+ )'
    
    $processedChunks = @()
    $chunkIndex = 0
    foreach ($c in $chunks) {
        if ([string]::IsNullOrWhiteSpace($c)) { continue }
        
        $chunkObj = @{
            chunk_id = "$docId-$chunkIndex"
            doc_id = $docId
            text = $c.Trim()
            index = $chunkIndex
        }
        $processedChunks += $chunkObj
        $chunkIndex++
    }
    
    # Metadata
    $metadata = @{
        doc_id = $docId
        title = $title
        path = $filePath
        goldmine_score = Get-GoldmineScore $content
        tags = @()
        summary = "" # Placeholder
    }
    
    # Export
    $metadataPath = Join-Path "$processedRoot\metadata" "$docId.json"
    $chunksPath = Join-Path "$processedRoot\chunks" "$docId.json"
    
    $metadata | ConvertTo-Json | Out-File -FilePath $metadataPath -Encoding utf8
    $processedChunks | ConvertTo-Json | Out-File -FilePath $chunksPath -Encoding utf8
    
    Write-Host "Processed: $title (Score: $($metadata.goldmine_score))"
}

# Main Loop
$files = Get-ChildItem -Path $corpusRoot -Filter "*.md" -Recurse
foreach ($f in $files) {
    Process-MarkdownFile $f.FullName
}

Write-Host "Ingestion complete. Processed $($files.Count) files."
