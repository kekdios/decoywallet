// Fixed wallet data - no longer fetches from blockchain
const FIXED_WALLET_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const FIXED_BALANCE = 1.248369;

// Generate a fake transaction ID
const generateTxId = () => {
  const chars = '0123456789abcdef';
  let txid = '';
  for (let i = 0; i < 64; i++) {
    txid += chars[Math.floor(Math.random() * chars.length)];
  }
  return txid;
};

// Generate mock transactions over the last 12 months
// 8 receive transactions and 1 send transaction (5th transaction)
// Total receives: 1.348369 BTC, Total sends: 0.1 BTC, Balance: 1.248369 BTC
const generateMockTransactions = () => {
  const now = Date.now();
  const twelveMonthsAgo = now - (365 * 24 * 60 * 60 * 1000);
  
  // Distribute 8 receives totaling 1.348369 BTC over 12 months
  const receiveAmounts = [
    0.15,     // Transaction 1 (oldest)
    0.18,     // Transaction 2
    0.22,     // Transaction 3
    0.16,     // Transaction 4
    0.188369, // Transaction 6 (after send)
    0.21,     // Transaction 7
    0.19,     // Transaction 8
    0.05,     // Transaction 9 (newest)
  ];
  
  const sendAmount = 0.1; // Transaction 5
  
  const transactions = [];
  
  // Transaction 1: Receive (12 months ago)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 800000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (0 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[0] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[0],
    from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    confirmations: 6,
  });
  
  // Transaction 2: Receive (10 months ago)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 810000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (2 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[1] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[1],
    from: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    confirmations: 6,
  });
  
  // Transaction 3: Receive (8 months ago)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 820000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (4 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[2] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[2],
    from: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    confirmations: 6,
  });
  
  // Transaction 4: Receive (6 months ago)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 830000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (6 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[3] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[3],
    from: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    confirmations: 6,
  });
  
  // Transaction 5: Send (4 months ago) - This is the send transaction
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 840000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (8 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: -sendAmount * 100000000,
    },
    type: 'send',
    amount: sendAmount,
    fee: 0.0001,
    feeRate: 138,
    to: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
    confirmations: 6,
  });
  
  // Transaction 6: Receive (3 months ago)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 850000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (9 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[4] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[4],
    from: '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs',
    confirmations: 6,
  });
  
  // Transaction 7: Receive (2 months ago)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 860000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (10 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[5] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[5],
    from: '3Kzh9qAqVWQhEsfQz7zEQL1EuSx5tyNLNS',
    confirmations: 6,
  });
  
  // Transaction 8: Receive (1 month ago)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 870000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((twelveMonthsAgo + (11 * 30 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[6] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[6],
    from: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    confirmations: 6,
  });
  
  // Transaction 9: Receive (2 weeks ago - newest)
  transactions.push({
    txid: generateTxId(),
    status: {
      confirmed: true,
      block_height: 880000,
      block_hash: '0000000000000000000123456789abcdef0123456789abcdef0123456789abcdef',
      block_time: Math.floor((now - (14 * 24 * 60 * 60 * 1000)) / 1000),
      value: receiveAmounts[7] * 100000000,
    },
    type: 'receive',
    amount: receiveAmounts[7],
    from: '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX',
    confirmations: 6,
  });
  
  // Sort by timestamp (newest first)
  return transactions.sort((a, b) => b.status.block_time - a.status.block_time);
};

// Get fixed wallet address and balance
export const findAddressInRange = async () => {
  return {
    address: FIXED_WALLET_ADDRESS,
    balance: FIXED_BALANCE,
  };
};

// Get fixed transactions
export const fetchAddressTransactions = async (address) => {
  // Return mock transactions
  return generateMockTransactions();
};

// Legacy functions kept for compatibility but not used
export const fetchAddressInfo = async (address) => {
  return {
    address: FIXED_WALLET_ADDRESS,
    chain_stats: {
      funded_txo_sum: 134836900000, // 1.348369 BTC in satoshis
      spent_txo_sum: 10000000, // 0.1 BTC in satoshis
    },
  };
};

export const getCachedAddress = () => {
  return FIXED_WALLET_ADDRESS;
};
