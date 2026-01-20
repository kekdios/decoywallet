# Bitcoin Vault - Decoy Wallet

A Bitcoin decoy/duress wallet application available as both a web app and Android app. Displays a fixed Bitcoin address with a simulated balance and transaction history, allowing users to appear to have Bitcoin while all transactions are simulated locally.

**Version**: 1.0.0

## ⚠️ Important Disclaimer

**This is a simulation wallet. No real Bitcoin is stored or transferred.** This application is designed for educational purposes and as a duress wallet tool. All transactions are simulated locally and do not interact with the actual Bitcoin blockchain.

## Features

- **Fixed Wallet Address**: Displays a permanent Bitcoin address with a fixed balance (1.248369 BTC)
- **Balance Display**: Shows balance in BTC, Satoshis, and multiple currencies (USD, EUR, GBP, JPY, etc.)
- **Transaction History**: Displays 8 receive transactions and 1 send transaction over the last 12 months
- **Simulated Sending**: Allows users to "send" Bitcoin to any address (simulated locally)
- **QR Code Support**: Scan QR codes to input recipient addresses or display your address
- **Transaction Confirmation**: Simulated transactions show as "pending" then "confirmed" after 1 minute
- **Password Protection**: Optional 4-digit numeric password for quick access
- **Dark Mode**: Light/dark theme support
- **Multi-language**: Support for English, Spanish, French, German, Italian, Portuguese, and Russian
- **Multi-currency**: Display values in USD, EUR, GBP, JPY, CNY, CAD, AUD, CHF, INR, BRL, KRW, MXN
- **Unit Selection**: Switch between BTC and Satoshi units
- **Recovery Passphrase**: Export 12-word recovery passphrase
- **Professional UI**: Modern, wallet-like interface with mobile-responsive design
- **Android App**: Native Android application built with Capacitor

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Capacitor** - Native Android app framework
- **CoinGecko API** - Bitcoin price data for multiple currencies
- **html5-qrcode** - QR code scanning
- **qrcode.react** - QR code generation

## Installation

### Web App

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Android App

1. Install dependencies (see above)

2. Build and sync to Android:
```bash
npm run build:android
```

3. Build APK:
```bash
cd android
./gradlew assembleDebug    # Debug build
./gradlew assembleRelease  # Release build
```

Or use the convenience script:
```bash
./build-apk.sh
```

4. Install on device:
```bash
./install-apk.sh
```

The release APK will be automatically copied to `releases/` directory for distribution.

## Usage

1. **View Wallet**: The app displays a fixed Bitcoin address (bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh) with a balance of 1.248369 BTC
2. **View Balance**: See your balance in BTC, Satoshis, or your selected currency
3. **View Transactions**: Browse the transaction history (8 receive + 1 send transaction)
4. **Send Bitcoin**: 
   - Enter or scan a recipient address
   - Enter amount (in BTC, Satoshis, or selected currency)
   - Click "Send Bitcoin"
   - Transaction will show as pending, then confirmed after 1 minute
5. **Receive Bitcoin**: Click "Receive" to view your wallet address and QR code
6. **Settings**: Access settings to configure:
   - Dark/Light mode
   - Language preference
   - Currency display
   - BTC/Satoshi unit selection
   - Password protection (4-digit numeric)
   - Export recovery passphrase

## How It Works

- The app displays a **fixed Bitcoin address** with a **permanent balance** of 1.248369 BTC
- Transaction history includes 8 receive transactions and 1 send transaction over the last 12 months
- All data is stored locally - no blockchain queries are made
- When you "send" Bitcoin:
  - The amount is deducted from your displayed balance (locally)
  - A simulated transaction is created and stored in localStorage
  - After 1 minute, the transaction status changes from "pending" to "confirmed"
  - **No actual Bitcoin is transferred** - this is all simulated
- Price data is fetched from CoinGecko API for currency conversion

## API Endpoints Used

- **CoinGecko API**: `https://api.coingecko.com/api/v3/simple/price`
  - Bitcoin price for multiple currencies: `?ids=bitcoin&vs_currencies=usd,eur,gbp,jpy,etc`

## Platform Support

### Web App
- Modern browsers with ES6+ support
- Camera access required for QR code scanning
- LocalStorage required for transaction persistence

### Android App
- Android 5.0 (API level 21) or higher
- Camera permission required for QR code scanning
- Internet permission for price data

## Building Android APK

See [BUILD_ANDROID.md](BUILD_ANDROID.md) for detailed command-line build instructions.

## Release APKs

Release APKs are available in the `releases/` directory. These are signed with the debug keystore for testing purposes.

## License

MIT License - see LICENSE file for details
