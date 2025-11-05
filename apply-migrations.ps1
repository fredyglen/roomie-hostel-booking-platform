# Apply Supabase Migrations Script
Write-Host "Applying Supabase Migrations..." -ForegroundColor Cyan
Write-Host ""

# Apply migrations
Write-Host "Applying migrations to database..." -ForegroundColor Yellow
supabase db push

Write-Host ""
Write-Host "Done!" -ForegroundColor Green

