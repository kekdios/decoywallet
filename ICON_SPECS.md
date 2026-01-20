# Android App Icon Specifications

## Format
- **File Format**: PNG (not ICO)
- **Color Mode**: RGB with transparency support
- **Recommended Source Size**: 1024x1024 pixels (square)

## Required Icon Sizes

Android requires icons in multiple sizes for different screen densities:

### Standard Icons (Full Icon)
- **mdpi**: 48x48 pixels
- **hdpi**: 72x72 pixels
- **xhdpi**: 96x96 pixels
- **xxhdpi**: 144x144 pixels
- **xxxhdpi**: 192x192 pixels

### Foreground Icons (For Adaptive Icons)
These are used for Android 8.0+ adaptive icons. The icon should be centered and leave some padding around edges (about 20% safe zone).

- **mdpi**: 108x108 pixels (foreground only, will be placed on background)
- **hdpi**: 162x162 pixels
- **xhdpi**: 216x216 pixels
- **xxhdpi**: 324x324 pixels
- **xxxhdpi**: 432x432 pixels

### Round Icons
Same sizes as standard icons, but with rounded corners (Android will handle this automatically if using adaptive icons).

## Design Guidelines

### For Best Results:
1. **Create a 1024x1024px source image** - This is the master file you'll use
2. **ADD PADDING AROUND YOUR ICON** - **IMPORTANT**: Keep your icon content in the center 70-80% of the canvas. Android adaptive icons crop the edges, so add transparent or background-colored padding around your icon to prevent it from being cut off.
   - Example: If your icon is 800x800px, center it in a 1024x1024px canvas with ~112px padding on each side
3. **Keep important content in the center 80%** - Android adaptive icons can be cropped/masked, so keep key elements centered
4. **Use transparent background** - Or solid color background (currently set to black #000000)
5. **High contrast** - Icons should be visible on various backgrounds
6. **Simple and recognizable** - Icons are small, so details should be clear at small sizes

### Current Setup:
- **Background Color**: Black (#000000) - defined in `android/app/src/main/res/values/ic_launcher_background.xml`
- **Foreground**: Your logo image (white Bitcoin symbol on black background)

## How to Use Your New Icon

1. **Create your icon** as a 1024x1024px PNG file
2. **Save it** as `public/decoylogo.png` (replace the existing one)
3. **Run the icon generator**:
   ```bash
   ./generate-icons.sh
   ```
4. **Rebuild the app**:
   ```bash
   ./build-apk.sh
   ```

The script will automatically generate all required sizes from your source image.

## Alternative: Manual Creation

If you want to create all sizes manually, you'll need to export:
- 5 sizes for standard icons (48, 72, 96, 144, 192px)
- 5 sizes for foreground icons (108, 162, 216, 324, 432px)
- Place them in the corresponding `mipmap-*` folders in `android/app/src/main/res/`

## File Structure

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   ├── ic_launcher_round.png (48x48)
│   └── ic_launcher_foreground.png (108x108)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   ├── ic_launcher_round.png (72x72)
│   └── ic_launcher_foreground.png (162x162)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   ├── ic_launcher_round.png (96x96)
│   └── ic_launcher_foreground.png (216x216)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   ├── ic_launcher_round.png (144x144)
│   └── ic_launcher_foreground.png (324x324)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    ├── ic_launcher_round.png (192x192)
    └── ic_launcher_foreground.png (432x432)
```

## Quick Summary

- **Format**: PNG (not ICO)
- **Source Size**: 1024x1024px recommended
- **Background**: Currently black (#000000)
- **Just create one file**: `public/decoylogo.png` at 1024x1024px
- **Run**: `./generate-icons.sh` to generate all sizes automatically
