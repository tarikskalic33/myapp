$html = Get-Content chat.html -Raw
$matches = [regex]::Matches($html, '(<script[^>]*>)(.*?)(</script>)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
for ($i=0; $i -lt $matches.Count; $i++) {
    $openTag = $matches[$i].Groups[1].Value
    $content = $matches[$i].Groups[2].Value
    Write-Host "Tag $i: $openTag - Length: $($content.Length)"
    if ($content.Length -gt 10) {
        $previewLen = [Math]::Min(100, $content.Length)
        Write-Host "  Preview: $($content.Substring(0, $previewLen))"
    }
}
