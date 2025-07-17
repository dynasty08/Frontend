@echo off
echo Invalidating CloudFront cache...

REM Replace DISTRIBUTION_ID with your actual CloudFront distribution ID
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo Cache invalidation initiated!