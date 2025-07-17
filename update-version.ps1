# PowerShell script to update version.json
Write-Host "Updating version.json for local testing..."

$buildNumber = Get-Random -Minimum 1000 -Maximum 9999
$version = "v" + (Get-Date -Format "yyyy.MM.dd") + "-" + $buildNumber
$buildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$versionJson = @{
    version = $version
    buildDate = $buildDate
} | ConvertTo-Json

# Write to file
$versionJson | Out-File -FilePath ".\src\assets\version.json" -Encoding utf8

Write-Host "Version updated to $version"
Write-Host "Build date set to $buildDate"