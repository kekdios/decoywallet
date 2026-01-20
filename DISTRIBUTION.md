# APK Distribution Guide

This guide explains how to distribute the Bitcoin Vault Android APK outside of app stores.

## Option 1: GitHub Releases (Recommended)

### Setup

1. **Build the release APK**:
   ```bash
   ./build-apk.sh
   ```
   This automatically copies the release APK to `releases/decoy_wallet-release-1.0.apk`

2. **Commit the release APK**:
   ```bash
   git add releases/
   git commit -m "Release v1.0.0 - Add APK"
   git push
   ```

3. **Create a GitHub Release**:
   - Go to your GitHub repository
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0`
   - Title: `Bitcoin Vault v1.0.0`
   - Description: Copy from `RELEASE_NOTES_TEMPLATE.md` or write your own
   - Attach file: `releases/decoy_wallet-release-1.0.apk`
   - Click "Publish release"

4. **Release Notes**: See `RELEASE_NOTES_TEMPLATE.md` for a ready-to-use template

5. **Users can download**:
   - Direct link: `https://github.com/YOUR_USERNAME/decoywallet/releases/download/v1.0.0/decoy_wallet-release-1.0.apk`
   - Or visit the Releases page and download

### Unpublishing a Release

**Yes, you can unpublish a GitHub release:**

1. **Go to your repository** → "Releases"
2. **Click on the release** you want to unpublish
3. **Click "Edit release"** (pencil icon)
4. **Scroll down** and click **"Unpublish release"** (red button at bottom)
5. **Confirm** the unpublishing

**Note**: 
- Unpublishing makes the release draft-only (not visible to public)
- You can republish it later by editing and clicking "Publish release"
- The release tag remains in your repository
- To completely delete, you'd need to delete the git tag separately

### Benefits
- ✅ Free
- ✅ Versioned releases
- ✅ Direct download links
- ✅ Release notes
- ✅ Automatic updates notification

## Option 2: Direct Website Hosting

1. **Host the APK** on your web server:
   - Upload `releases/decoy_wallet-release-1.0.apk` to your website
   - Create a download page with installation instructions

2. **Provide download link**:
   ```html
   <a href="/downloads/decoy_wallet-release-1.0.apk" download>
     Download Bitcoin Vault APK
   </a>
   ```

3. **Add installation instructions**:
   - Enable "Install from Unknown Sources"
   - Download and install steps

## Option 3: File Sharing Services

### Google Drive / Dropbox / OneDrive

1. Upload APK to cloud storage
2. Set sharing to "Anyone with the link"
3. Share the public link

**Note**: Some users may need to download through a browser rather than the app.

## Option 4: APK Distribution Sites

### APKMirror
- Requires manual submission
- Good for wider distribution
- Users trust the platform

### F-Droid (Open Source)
- Only for open source apps
- Requires app to be open source
- Good for privacy-conscious users

### APKPure
- Alternative to Google Play
- Requires submission process

## Installation Instructions for Users

When distributing, include these instructions:

1. **Download the APK** to your Android device
2. **Enable Unknown Sources**:
   - Settings → Security → Enable "Install from Unknown Sources"
   - Or Settings → Apps → Special Access → Install Unknown Apps → Select your browser/file manager
3. **Open the APK file** and tap "Install"
4. **Launch the app** from your app drawer

## Security Considerations

- **Current APKs are signed with debug keystore** - Fine for testing, but for production:
  - Create a proper release keystore
  - Sign APKs with the release keystore
  - Keep the keystore secure and backed up

## Recommended Approach

**GitHub Releases** is the best option because:
- It's free and integrated with your code
- Provides versioning and release notes
- Direct download links
- Professional appearance
- Easy to update with new versions
