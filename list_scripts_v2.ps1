$html = Get-Content chat.html -Raw
$matches = [regex]::Matches($html, '(<script[^>]*>)(.*?)(</script>)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
for ($i=0; $i -lt $matches.Count; $i++) {
    $tagHeaders = $matches[$i].Groups[1].Value
    $body = $matches[$i].Groups[2].Value
    Write-Host "Script Index: $i"
    Write-Host "Tag: $tagHeaders"
    Write-Host "Length: $($body.Length)"
    if ($body.Length -gt 20) {
        $preview = $body.Substring(0, [Math]::Min(200, $body.Length))
        Write-Host "Preview: $preview"
    }
    Write-Host "----------------"
}
