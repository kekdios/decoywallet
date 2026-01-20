import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { findAddressInRange, fetchAddressTransactions } from '../services/blockchainService';
import { startPriceUpdates, stopPriceUpdates, convertBTCtoCurrency, getCurrencySymbol } from '../services/priceService';
import { getSimulatedTransactions, getTotalSentAmount } from '../services/transactionService';
import { usePreferences } from './PreferencesContext';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { currency } = usePreferences();
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [simulatedTransactions, setSimulatedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate displayed balance (real balance - simulated sent amounts)
  const displayedBalance = balance - getTotalSentAmount();

  // Load wallet data
  const loadWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get fixed address and balance
      const addressData = await findAddressInRange();
      setAddress(addressData.address);
      setBalance(addressData.balance);

      // Get fixed transactions
      const txs = await fetchAddressTransactions(addressData.address);
      setTransactions(txs);

      // Load simulated transactions
      const simTxs = getSimulatedTransactions();
      setSimulatedTransactions(simTxs);

    } catch (err) {
      console.error('Error loading wallet:', err);
      setError(err.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize wallet on mount
  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  // Start price updates with selected currency
  useEffect(() => {
    const cleanup = startPriceUpdates((price) => {
      setBtcPrice(price);
    }, currency);

    return () => {
      cleanup();
      stopPriceUpdates();
    };
  }, [currency]);

  // Refresh transactions
  const refreshTransactions = useCallback(async () => {
    if (!address) return;
    
    try {
      setError(null);
      // Get fixed transactions (they don't change)
      const txs = await fetchAddressTransactions(address);
      setTransactions(txs);
      
      const simTxs = getSimulatedTransactions();
      setSimulatedTransactions(simTxs);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
      setError('Failed to refresh transactions. Please try again.');
    }
  }, [address]);

  // Add simulated transaction
  const addSimulatedTransaction = useCallback((tx) => {
    const simTxs = getSimulatedTransactions();
    setSimulatedTransactions(simTxs);
  }, []);

  const currencyValue = convertBTCtoCurrency(displayedBalance, currency);
  const currencySymbol = getCurrencySymbol(currency);

  const value = {
    address,
    balance: displayedBalance,
    realBalance: balance,
    btcPrice,
    currency,
    currencySymbol,
    transactions,
    simulatedTransactions,
    loading,
    error,
    loadWallet,
    refreshTransactions,
    addSimulatedTransaction,
    currencyValue,
    // Legacy support
    usdPrice: btcPrice,
    usdValue: currencyValue,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
