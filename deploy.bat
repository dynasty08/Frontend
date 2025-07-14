@echo off
echo Building Angular app...
ng build --configuration production

echo Uploading to S3...
aws s3 sync dist/angularfolder/ s3://awsdynaty --delete

echo Invalidating CloudFront (if you have it)...
REM aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo Deployment complete!
echo Website URL: http://awsdynasty.s3-website-ap-southeast-1.amazonaws.com
