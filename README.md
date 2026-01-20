# Bitcoin Vault - Decoy Wallet

A web-based Bitcoin decoy/duress wallet application that displays a real blockchain address (with 0.5-1 BTC balance) as the user's wallet and simulates sending Bitcoin transactions.

## ⚠️ Important Disclaimer

**This is a simulation wallet. No real Bitcoin is stored or transferred.** This application is designed for educational purposes and as a duress wallet tool. All transactions are simulated locally and do not interact with the actual Bitcoin blockchain.

## Features

- **Real Blockchain Address**: Automatically finds and displays a Bitcoin address with 0.5-1 BTC balance from the blockchain
- **Balance Display**: Shows balance in both BTC and USD (updated in real-time)
- **Transaction History**: Displays real blockchain transactions for the address
- **Simulated Sending**: Allows users to "send" Bitcoin to any address (simulated locally)
- **QR Code Support**: Scan QR codes to input recipient addresses
- **Transaction Confirmation**: Simulated transactions show as "pending" then "confirmed" after 1 minute
- **Professional UI**: Modern, wallet-like interface with responsive design

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Blockstream API** - Blockchain data
- **CoinGecko API** - Bitcoin price data
- **html5-qrcode** - QR code scanning
- **qrcode.react** - QR code generation

## Installation

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

## Usage

1. **View Wallet**: The app automatically finds and displays a Bitcoin address with balance in the target range
2. **View Balance**: See your balance in BTC and USD
3. **View Transactions**: Browse real blockchain transactions for the address
4. **Send Bitcoin**: 
   - Enter or scan a recipient address
   - Enter amount (in BTC or USD)
   - Click "Send Bitcoin"
   - Transaction will show as pending, then confirmed after 1 minute
5. **Receive Bitcoin**: Click "Receive" to view your wallet address and QR code

## How It Works

- The app searches the Bitcoin blockchain for addresses with balances between 0.5-1 BTC
- Once found, it displays that address as "your wallet"
- Real blockchain transactions are fetched and displayed
- When you "send" Bitcoin:
  - The amount is deducted from your displayed balance (locally)
  - A simulated transaction is created and stored in localStorage
  - After 1 minute, the transaction status changes from "pending" to "confirmed"
  - **No actual Bitcoin is transferred** - this is all simulated

## API Endpoints Used

- **Blockstream API**: `https://blockstream.info/api`
  - Address info: `/address/{address}`
  - Transactions: `/address/{address}/txs`
- **CoinGecko API**: `https://api.coingecko.com/api/v3/simple/price`
  - Bitcoin price: `?ids=bitcoin&vs_currencies=usd`

## Browser Compatibility

- Modern browsers with ES6+ support
- Camera access required for QR code scanning
- LocalStorage required for transaction persistence

## License

MIT License - see LICENSE file for details
