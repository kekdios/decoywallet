# Building Android APK from Command Line

This guide explains how to build the Bitcoin Vault Android app without Android Studio.

## Prerequisites

You need to install the following:

### 1. Java Development Kit (JDK)

**On macOS:**
```bash
# Install using Homebrew (Java 21 is required)
brew install openjdk@21

# Set JAVA_HOME for this session:
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"

# Or add to ~/.zshrc for permanent setup:
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21"' >> ~/.zshrc
```

**Verify installation:**
```bash
java -version
# Should show version 21
```

### 2. Android SDK Command Line Tools

**Option A: Install via Homebrew (Recommended)**
```bash
brew install --cask android-commandlinetools
```

**Option B: Manual Installation**
1. Download from: https://developer.android.com/studio#command-tools
2. Extract to a location like `~/android-sdk`
3. Set environment variables:
   ```bash
   export ANDROID_HOME=~/android-sdk
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

**Install required SDK components:**
```bash
# Accept licenses
yes | sdkmanager --licenses

# Install Android SDK Platform 34 (or latest)
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

## Build Steps

### Step 1: Build the Web App
```bash
npm run build
```

### Step 2: Sync to Android
```bash
npm run sync:android
```

### Step 3: Build the APK

**Set environment variables first:**
```bash
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Debug APK (for testing):**
```bash
cd android
./gradlew assembleDebug
```

**Or use the provided build script:**
```bash
./build-apk.sh
```

The APK will be created at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK (for distribution):**
```bash
cd android
./gradlew assembleRelease
```

The APK will be created at:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Note:** Release APKs need to be signed before installation. For testing, use the debug APK.

## Install on Device

### Option 1: Using ADB (Android Debug Bridge)
```bash
# Connect your Android device via USB with USB debugging enabled
# Install the APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Option 2: Transfer and Install Manually
1. Copy `app-debug.apk` to your Android device
2. On your device, enable "Install from Unknown Sources" in Settings
3. Open the APK file and install

## Troubleshooting

### "Unable to locate Java Runtime"
- Install JDK 17 or higher
- Set `JAVA_HOME` environment variable
- Add Java to your PATH

### "SDK location not found"
- Set `ANDROID_HOME` environment variable
- Ensure Android SDK is properly installed

### "Gradle build failed"
- Check that you've accepted Android SDK licenses: `yes | sdkmanager --licenses`
- Ensure all required SDK components are installed
- Check `android/build.gradle` for any version conflicts

### Build takes a long time
- First build downloads Gradle and dependencies (this is normal)
- Subsequent builds are much faster

## Quick Build Script

You can create a simple build script:

```bash
#!/bin/bash
# build-apk.sh

echo "Building web app..."
npm run build

echo "Syncing to Android..."
npm run sync:android

echo "Building APK..."
cd android
./gradlew assembleDebug

echo "APK created at: android/app/build/outputs/apk/debug/app-debug.apk"
```

Make it executable:
```bash
chmod +x build-apk.sh
./build-apk.sh
```
