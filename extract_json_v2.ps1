$line = Get-Content line_with_data.txt -Raw
if ($line -match 'id="client-bootstrap"[^>]*>(?<json>.*?)<\/script>') {
    $matches['json'] | Out-File -FilePath final_data.json -Encoding utf8
    Write-Host "Success"
} else {
    Write-Host "Failed to match"
}
