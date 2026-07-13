# deploy-itchio.ps1
# Push build package to itch.io using butler.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$version = (Get-Content package.json | ConvertFrom-Json).version
$releaseDir = Join-Path $Root "release"
$outZip = Join-Path $releaseDir "space-dandy-game-browser-v$version.zip"

if (-not (Test-Path $outZip)) {
  Write-Host "Release zip not found. Packaging now..."
  powershell -ExecutionPolicy Bypass -File ./scripts/package-itchio.ps1
}

# Check for butler installation
$butler = Get-Command butler -ErrorAction SilentlyContinue
if (-not $butler) {
  Write-Warning "Butler CLI is not installed on this system or not in PATH."
  Write-Host "Install butler by following: https://itch.io/docs/butler/"
  exit 1
}

if (-not $env:BUTLER_API_KEY) {
  Write-Warning "BUTLER_API_KEY environment variable is not set."
  Write-Host "Please set your API key by running:"
  Write-Host "  `$env:BUTLER_API_KEY = '<your-itch-api-key>'"
  Write-Host "Then re-run this script."
  exit 1
}

Write-Host "Pushing space-dandy-game-browser-v$version.zip to itch.io..."
butler push $outZip subtiliorars/jimmythehat-space-dandy-groove-patrol:html

Write-Host "Checking push status..."
butler status subtiliorars/jimmythehat-space-dandy-groove-patrol:html
