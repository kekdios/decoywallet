#!/bin/bash
# Install APK on connected Android device

APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found. Building first..."
    ./build-apk.sh
fi

echo "📱 Installing APK on connected device..."
export PATH=$PATH:/opt/homebrew/share/android-commandlinetools/platform-tools
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ App installed successfully!"
    echo "Look for 'Bitcoin Vault' in your app drawer."
else
    echo ""
    echo "❌ Installation failed."
    echo "Make sure:"
    echo "  1. Your phone is connected via USB"
    echo "  2. USB debugging is enabled"
    echo "  3. You've authorized the computer on your phone"
fi
