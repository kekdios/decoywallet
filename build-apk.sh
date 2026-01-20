#!/bin/bash
# Build script for Android APK

# Set up environment variables
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Build web app
echo "Building web app..."
npm run build

# Sync to Android
echo "Syncing to Android..."
npm run sync:android

# Build APKs (both debug and release)
echo "Building APKs..."
cd android
./gradlew assembleDebug assembleRelease

echo ""
echo "✅ Debug APK created at: android/app/build/outputs/apk/debug/decoy_wallet-debug-1.0.apk"
echo ""

# Copy release APK to releases directory for GitHub
if [ -f "android/app/build/outputs/apk/release/decoy_wallet-release-1.0.apk" ]; then
    mkdir -p releases
    cp android/app/build/outputs/apk/release/decoy_wallet-release-1.0.apk releases/
    echo "✅ Release APK copied to: releases/decoy_wallet-release-1.0.apk (ready for GitHub)"
    echo ""
fi

echo "To install on your device:"
echo "  adb install android/app/build/outputs/apk/debug/decoy_wallet-debug-1.0.apk"
