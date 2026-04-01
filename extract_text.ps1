$json = Get-Content final_data.json -Raw
$matches = [regex]::Matches($json, '"text":"(.*?)"')
$output = ""
foreach ($m in $matches) {
    $output += "MESSAGE: " + $m.Groups[1].Value + "`r`n`r`n"
}
$output | Out-File -FilePath extracted_text.txt -Encoding utf8
Write-Host "Extracted text to extracted_text.txt"
