# Automatic Version System

This project includes an automatic versioning system that updates the version displayed in the dashboard whenever the application is deployed through the CI/CD pipeline.

## How It Works

1. **Version File Generation**:
   - During the build process, a `version.json` file is generated in the `src/assets` directory
   - The version format is `vYYYY.MM.DD-BUILD_NUMBER` (e.g., `v2023.05.15-123`)
   - The build date is also included in the file

2. **Version Service**:
   - The `VersionService` reads this file at runtime
   - If the file can't be loaded (e.g., during local development), it falls back to a default version

3. **Dashboard Display**:
   - The dashboard component uses the `VersionService` to display the current version
   - The version and build date are shown in the dashboard UI

## Local Development

For local development, a placeholder `version.json` file is included in the repository. You can update it manually using:

```
# Windows Command Prompt
update-version.bat

# PowerShell
.\update-version.ps1
```

## CI/CD Pipeline

In the CI/CD pipeline, the version is automatically generated during the build phase:

```yaml
build:
  commands:
    - echo "Generating version file"
    - echo "{\"version\": \"v$(date +%Y.%m.%d)-$CODEBUILD_BUILD_NUMBER\", \"buildDate\": \"$(date)\"}" > src/assets/version.json
    - ng build --configuration production
```

## Environment Variables

The following environment variables can be set in your CodeBuild project:

- `CODEBUILD_BUILD_NUMBER`: Automatically provided by CodeBuild
- `CLOUDFRONT_DISTRIBUTION_ID`: Optional. If provided, a CloudFront invalidation will be created after deployment

## Manual Testing

To test the version display without deploying:

1. Run `update-version.ps1` to generate a new version
2. Start the application with `ng serve`
3. Navigate to the dashboard to see the updated version