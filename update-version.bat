@echo off
echo Updating version.json for local testing...

set BUILD_NUMBER=%RANDOM%
set VERSION=v%date:~10,4%.%date:~4,2%.%date:~7,2%-%BUILD_NUMBER%
set BUILD_DATE=%date% %time%

echo Creating version.json...
echo {^
  "version": "%VERSION%",^
  "buildDate": "%BUILD_DATE%"^
} > src\assets\version.json

echo Version updated to %VERSION%
echo Build date set to %BUILD_DATE%