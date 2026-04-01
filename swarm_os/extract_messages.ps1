$json = Get-Content final_data.json -Raw
$matches = [regex]::Matches($json, '"parts":\["(.*?)"\]')
foreach ($m in $matches) {
    Write-Host "--- MESSAGE ---"
    Write-Host $m.Groups[1].Value
}
