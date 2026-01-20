#!/bin/bash
# Generate Android app icons from decoylogo.png

LOGO="public/app_icon.png"
RES_DIR="android/app/src/main/res"

# Icon sizes for different densities
# mdpi: 48x48, hdpi: 72x72, xhdpi: 96x96, xxhdpi: 144x144, xxxhdpi: 192x192

echo "Generating Android app icons from $LOGO..."

# Generate regular icons
echo "Creating mipmap-mdpi icon (48x48)..."
sips -z 48 48 "$LOGO" --out "$RES_DIR/mipmap-mdpi/ic_launcher.png"
sips -z 48 48 "$LOGO" --out "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"

echo "Creating mipmap-hdpi icon (72x72)..."
sips -z 72 72 "$LOGO" --out "$RES_DIR/mipmap-hdpi/ic_launcher.png"
sips -z 72 72 "$LOGO" --out "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"

echo "Creating mipmap-xhdpi icon (96x96)..."
sips -z 96 96 "$LOGO" --out "$RES_DIR/mipmap-xhdpi/ic_launcher.png"
sips -z 96 96 "$LOGO" --out "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"

echo "Creating mipmap-xxhdpi icon (144x144)..."
sips -z 144 144 "$LOGO" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher.png"
sips -z 144 144 "$LOGO" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"

echo "Creating mipmap-xxxhdpi icon (192x192)..."
sips -z 192 192 "$LOGO" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png"
sips -z 192 192 "$LOGO" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"

# Generate foreground icons (for adaptive icons)
# Note: Your source image should already have padding (icon in center 70-80% of canvas)
# If edges are getting cut off, add more padding to your source app_icon.png
echo "Creating foreground icons for adaptive icons..."
sips -z 108 108 "$LOGO" --out "$RES_DIR/mipmap-mdpi/ic_launcher_foreground.png"
sips -z 162 162 "$LOGO" --out "$RES_DIR/mipmap-hdpi/ic_launcher_foreground.png"
sips -z 216 216 "$LOGO" --out "$RES_DIR/mipmap-xhdpi/ic_launcher_foreground.png"
sips -z 324 324 "$LOGO" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher_foreground.png"
sips -z 432 432 "$LOGO" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png"

echo "✅ Icons generated successfully!"
echo "Rebuild the APK to see the new icon: ./build-apk.sh"
