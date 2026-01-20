# Cursor Prompt: Convert Web App to Android App

Copy and paste this prompt when you're in your other project folder:

---

**I want to convert this existing web app into an Android app using Capacitor, similar to how the Bitcoin Vault app was converted. The app should function exactly as it does now, with no changes to functionality. I also need to be able to build an installable APK file.**

**Requirements:**
1. Install and configure Capacitor for Android
2. Add Android platform support
3. Configure Android permissions (camera, internet, etc. as needed for this app)
4. Set up build scripts for creating APK files
5. Ensure the app works exactly as it currently does - no functionality changes
6. Create a `releases/` directory for APK distribution
7. Update build scripts to automatically copy release APKs to the releases directory
8. Configure APK naming (use format: `appname-buildtype-version.apk`)
9. Sign release builds with debug keystore (for testing)
10. Add safe area support for Android status bar/camera notch
11. Make headers sticky so they don't disappear when scrolling

**What to preserve:**
- All existing functionality
- All existing UI/UX
- All existing features
- Current styling and design
- All existing dependencies and services

**What to add:**
- Capacitor dependencies
- Android platform
- Build scripts (build-apk.sh, install-apk.sh)
- Android permissions configuration
- Safe area CSS for mobile
- Sticky headers

**Reference implementation:** The Bitcoin Vault app at `/Users/private/decoywallet` shows a complete working example of this conversion.

**Deliverables:**
1. Working Android APK that can be installed on devices
2. Build scripts for easy APK creation
3. Updated documentation (README) with Android build instructions
4. All code changes needed for Android compatibility

Please implement this conversion while maintaining 100% of the current app functionality.

---

## Additional Context (if needed)

If the app has specific requirements, you can add:

- **If the app uses specific APIs or services:** "The app uses [API/service name] - ensure this works in the Android WebView"
- **If the app has specific file access needs:** "The app needs access to [specific files/permissions]"
- **If the app has specific build requirements:** "The app requires [specific build steps or dependencies]"

## Quick Start Checklist

After running the prompt, verify:
- [ ] `npm install` works
- [ ] `npm run build` works
- [ ] `./build-apk.sh` creates APK successfully
- [ ] APK installs on Android device
- [ ] App functions identically to web version
- [ ] All features work in Android app
