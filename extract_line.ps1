$line = Select-String -Path chat.html -Pattern 'client-bootstrap' | Select-Object -First 1 -ExpandProperty Line
$line | Out-File -FilePath line_with_data.txt -Encoding utf8
Write-Host "Done"
