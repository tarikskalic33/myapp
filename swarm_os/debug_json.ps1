$json = Get-Content final_data.json -Raw
$index = $json.IndexOf('"mapping"')
if ($index -ge 0) {
    $json.Substring($index, 5000) | Out-File -FilePath mapping_debug.txt -Encoding utf8
    Write-Host "Success"
} else {
    Write-Host "Mapping not found"
}
