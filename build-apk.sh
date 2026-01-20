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

# Build APK
echo "Building APK..."
cd android
./gradlew assembleDebug

echo ""
echo "✅ APK created at: android/app/build/outputs/apk/debug/decoy_wallet-debug-1.0.apk"
echo ""
echo "To install on your device:"
echo "  adb install android/app/build/outputs/apk/debug/decoy_wallet-debug-1.0.apk"
