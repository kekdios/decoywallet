// Transaction service for managing simulated transactions
const STORAGE_KEY = 'bitcoinVault_simulatedTransactions';

// Generate a fake transaction ID
const generateFakeTxId = () => {
  const chars = '0123456789abcdef';
  let txid = '';
  for (let i = 0; i < 64; i++) {
    txid += chars[Math.floor(Math.random() * chars.length)];
  }
  return txid;
};

// Get all simulated transactions
export const getSimulatedTransactions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading simulated transactions:', error);
    return [];
  }
};

// Save simulated transactions
const saveSimulatedTransactions = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving simulated transactions:', error);
  }
};

// Create a new simulated transaction
export const createSimulatedTransaction = (recipient, amount, fee = 0.0001) => {
  const transactions = getSimulatedTransactions();
  const newTransaction = {
    txid: generateFakeTxId(),
    recipient,
    amount: parseFloat(amount),
    fee: parseFloat(fee),
    feeRate: 138, // sat/byte
    status: 'pending',
    timestamp: Date.now(),
    confirmations: 0,
    type: 'sent'
  };
  
  transactions.push(newTransaction);
  saveSimulatedTransactions(transactions);
  
  return newTransaction;
};

// Update transaction status
export const updateTransactionStatus = (txid, status, confirmations = 0) => {
  const transactions = getSimulatedTransactions();
  const index = transactions.findIndex(tx => tx.txid === txid);
  
  if (index !== -1) {
    transactions[index].status = status;
    transactions[index].confirmations = confirmations;
    saveSimulatedTransactions(transactions);
    return transactions[index];
  }
  
  return null;
};

// Get total sent amount (for balance calculation)
export const getTotalSentAmount = () => {
  const transactions = getSimulatedTransactions();
  return transactions.reduce((total, tx) => {
    if (tx.type === 'sent') {
      return total + tx.amount + tx.fee;
    }
    return total;
  }, 0);
};

// Clear all simulated transactions (for testing/reset)
export const clearSimulatedTransactions = () => {
  localStorage.removeItem(STORAGE_KEY);
};
