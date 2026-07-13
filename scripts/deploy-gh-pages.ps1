# Redeploy static build to gh-pages (no workflow OAuth scope required).
# Usage: powershell -File scripts/deploy-gh-pages.ps1
$ErrorActionPreference = "Stop"
Remove-Item Env:GITHUB_TOKEN -ErrorAction SilentlyContinue
Set-Location (Split-Path $PSScriptRoot -Parent)
if (Test-Path package-lock.json) { npm ci } else { npm install }
npm run build
$stage = Join-Path $env:TEMP ("pages-deploy-" + [guid]::NewGuid().ToString("n"))
New-Item -ItemType Directory -Path $stage | Out-Null
Copy-Item -Recurse -Force .\dist\* $stage\
New-Item -ItemType File -Path (Join-Path $stage ".nojekyll") -Force | Out-Null
$remote = (git remote get-url origin)
Push-Location $stage
git init -q
git checkout -b gh-pages | Out-Null
git add -A
git -c user.email="pages-deploy@local" -c user.name="pages-deploy" commit -qm "deploy: Pages"
git remote add origin $remote
git push -f origin gh-pages
Pop-Location
Remove-Item -Recurse -Force $stage
Write-Host "Deployed $remote"
