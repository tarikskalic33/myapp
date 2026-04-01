$content = Get-Content chat.html -Raw
$startString = 'id="client-bootstrap" type="application/json">'
$endString = '</script>'
$startIndex = $content.IndexOf($startString)
if ($startIndex -ge 0) {
    $startIndex += $startString.Length
    $endIndex = $content.IndexOf($endString, $startIndex)
    if ($endIndex -ge 0) {
        $json = $content.Substring($startIndex, $endIndex - $startIndex)
        $json | Out-File -FilePath chat_data.json -Encoding utf8
        Write-Host "Extracted to chat_data.json"
    } else {
        Write-Host "End tag not found"
        exit 1
    }
} else {
    Write-Host "Start tag not found"
    exit 1
}
