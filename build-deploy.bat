@echo off
echo Building Angular application in production mode...
ng build --configuration production

echo Deploying to S3...
aws s3 sync dist/angularfolder/browser/ s3://awsdynasty --delete

echo Deployment completed!