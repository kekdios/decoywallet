import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { usePreferences } from '../context/PreferencesContext';
import { convertBTCtoCurrency, getCurrencySymbol } from '../services/priceService';
import { formatAmount as formatUnitAmount, getUnitLabel } from '../services/unitService';
import { t } from '../services/translations';
import TransactionDetails from './TransactionDetails';

const TransactionList = ({ onTransactionClick }) => {
  const { transactions, simulatedTransactions, currency, currencySymbol, loading } = useWallet();
  const { language, unit } = usePreferences();

  // Combine real and simulated transactions
  const allTransactions = [
    ...transactions.map(tx => ({
      ...tx,
      txType: 'real',
      isReceived: tx.type === 'receive', // Use the type field from mock data
    })),
    ...simulatedTransactions.map(tx => ({
      ...tx,
      txType: 'simulated',
      isReceived: false,
    }))
  ].sort((a, b) => {
    // Sort by timestamp (newest first)
    const timeA = a.status?.block_time || a.timestamp || 0;
    const timeB = b.status?.block_time || b.timestamp || 0;
    return timeB - timeA;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000 || timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000 || timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Group transactions by month/year
  const groupTransactionsByMonth = (transactions) => {
    const groups = {};
    transactions.forEach(tx => {
      const timestamp = tx.status?.block_time || tx.timestamp || 0;
      const date = new Date(timestamp * 1000 || timestamp);
      const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(tx);
    });
    return groups;
  };

  const formatAmount = (tx) => {
    if (tx.txType === 'simulated') {
      return tx.amount;
    }
    // For real transactions, use the amount field or calculate from value
    if (tx.amount !== undefined) {
      return Math.abs(tx.amount);
    }
    return tx.status?.value ? Math.abs(tx.status.value) / 100000000 : 0;
  };

  const getStatusBadge = (tx) => {
    if (tx.txType === 'simulated') {
      if (tx.status === 'confirmed') {
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Confirmed
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </span>
        );
      }
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Confirmed
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4">
        <div className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const groupedTransactions = groupTransactionsByMonth(allTransactions);
  const sortedMonths = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB - dateA;
  });

  if (allTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {sortedMonths.map((month, monthIndex) => (
        <div key={month}>
          {/* Date Separator */}
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
            {month}
          </div>
          
          {/* Transactions for this month */}
          {groupedTransactions[month].map((tx, index) => {
            const amount = formatAmount(tx);
            const currencyValue = convertBTCtoCurrency(amount, currency);
            const isSent = tx.txType === 'simulated' || !tx.isReceived;

            return (
              <div
                key={tx.txid || `${month}-${index}`}
                onClick={() => onTransactionClick && onTransactionClick(tx)}
                className="px-4 py-3 flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Icon - Blue circle with building/arrow */}
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {isSent ? t('sentBitcoin', language) : t('receivedBitcoin', language)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {tx.txType === 'simulated' && tx.recipient 
                          ? `To: ${tx.recipient.substring(0, 20)}...`
                          : tx.txType === 'real' && tx.type === 'send' && tx.to
                          ? `To: ${tx.to.substring(0, 20)}...`
                          : tx.txType === 'real' && tx.type === 'receive' && tx.from
                          ? `From: ${tx.from.substring(0, 20)}...`
                          : 'Bitcoin transaction'}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-medium ${isSent ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {isSent ? '-' : '+'}{formatUnitAmount(amount, unit)} {getUnitLabel(unit)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {currencySymbol}{currencyValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
