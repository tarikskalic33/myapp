$data = Get-Content script_7_data.txt -Raw
# Try searching for "text" or "parts" or "content"
$regexes = @(
    '\"text\":\"(.*?)\"',
    '\"parts\":\[\"(.*?)\"\]',
    '\"content\":\{\"parts\":\[\"(.*?)\"\]\}'
)

foreach ($r in $regexes) {
    Write-Host "Trying Regex: $r"
    $matches = [regex]::Matches($data, $r)
    foreach ($m in $matches) {
        Write-Host "  Found: $($m.Groups[1].Value)"
    }
}

# Also try searching for the "title" of the conversation
$titleMatch = [regex]::Match($data, '\"title\":\"(.*?)\"')
if ($titleMatch.Success) {
    Write-Host "Title: $($titleMatch.Groups[1].Value)"
}
