$html = Get-Content chat.html -Raw
$matches = [regex]::Matches($html, '(<script[^>]*>)(.*?)(</script>)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$body = $matches[7].Groups[2].Value
$body | Out-File -FilePath script_7_data.txt -Encoding utf8
Write-Host "Saved Script 7 to script_7_data.txt"
