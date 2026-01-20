import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { usePreferences } from '../context/PreferencesContext';
import { convertBTCtoCurrency, getCurrencySymbol } from '../services/priceService';
import { formatAmount, getUnitLabel } from '../services/unitService';
import { t } from '../services/translations';

const TransactionDetails = ({ transaction, onClose }) => {
  const { btcPrice, currency, currencySymbol } = useWallet();
  const { language, unit } = usePreferences();
  const memoKey = `bitcoinVault_memo_${transaction.txid}`;
  const [memo, setMemo] = useState(() => {
    return localStorage.getItem(memoKey) || transaction.memo || '';
  });
  const [copied, setCopied] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Save memo to localStorage when it changes
  useEffect(() => {
    if (memo) {
      localStorage.setItem(memoKey, memo);
    } else {
      localStorage.removeItem(memoKey);
    }
  }, [memo, memoKey]);

  const isSent = transaction.txType === 'simulated' || !transaction.isReceived;
  const amount = transaction.txType === 'simulated' 
    ? transaction.amount 
    : transaction.amount !== undefined 
      ? Math.abs(transaction.amount)
      : transaction.status?.value ? Math.abs(transaction.status.value) / 100000000 : 0;

  const fee = transaction.fee || 0.0001;
  const totalAmount = amount + fee;
  const feePercentage = totalAmount > 0 ? (fee / totalAmount) * 100 : 0;
  const feeRate = transaction.feeRate || 138; // sat/byte

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000 || timestamp);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const copyTxId = () => {
    if (transaction.txid) {
      navigator.clipboard.writeText(transaction.txid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRecipientAddress = () => {
    if (transaction.txType === 'simulated' && transaction.recipient) {
      return transaction.recipient;
    }
    if (transaction.txType === 'real' && transaction.type === 'send' && transaction.to) {
      return transaction.to;
    }
    if (transaction.txType === 'real' && transaction.type === 'receive' && transaction.from) {
      return transaction.from;
    }
    return transaction.txid || 'Unknown';
  };

  const recipientAddress = getRecipientAddress();
  const shortAddress = recipientAddress.length > 8 
    ? `${recipientAddress.substring(0, 4)}...${recipientAddress.substring(recipientAddress.length - 4)}`
    : recipientAddress;

  const handleViewOnBlockchain = () => {
    setShowErrorModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Dark Blue Header */}
      <header className="bg-blue-900 text-white header-safe sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img src="/decoylogo.png" alt="Bitcoin Vault" className="h-8 w-8 object-contain" />
            <h1 className="text-lg font-semibold">
              {isSent ? t('sentFunds', language) : t('receivedFunds', language)}
            </h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Amount Section */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {isSent ? '-' : '+'}{formatAmount(amount, unit)} {getUnitLabel(unit)}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {currencySymbol}{convertBTCtoCurrency(amount, currency).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency} @ {currencySymbol}{btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency} per BTC
          </div>
        </div>

        {/* Details Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            {t('details', language)}
          </h2>

          <div className="space-y-4">
            {/* Miner Fee */}
            {isSent && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('minerFee', language)}:</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {formatAmount(fee, unit)} {getUnitLabel(unit)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {currencySymbol}{convertBTCtoCurrency(fee, currency).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {feePercentage.toFixed(2)}% of total amount
                </div>
              </div>
            )}

            {/* Sending to / Receiving from */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isSent ? t('sendingTo', language) : t('receivingFrom', language)}
              </div>
              <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₿</span>
                </div>
                <span className="text-sm font-mono text-gray-900 dark:text-white">{shortAddress}</span>
              </button>
            </div>

            {/* Date */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('date', language)}:</div>
              <div className="text-base text-gray-900 dark:text-white">
                {formatDate(transaction.status?.block_time || transaction.timestamp)}
              </div>
            </div>

            {/* Confirmations */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('confirmations', language)}:</div>
                <div className="text-base font-semibold text-green-600 dark:text-green-400">{t('confirmed', language)}</div>
              </div>
              {isSent && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Fee rate: {feeRate} sat/byte
                </div>
              )}
            </div>

            {/* Memo */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('memo', language)}:</div>
              <div className="relative">
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder={t('enterMemo', language)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-400 min-h-[44px]"
                />
                {memo && (
                  <button
                    onClick={() => setMemo('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Transaction ID */}
            <div className="pb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('transactionId', language)}:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-xs text-gray-900 dark:text-white break-all">
                  {transaction.txid || 'N/A'}
                </div>
                <button
                  onClick={copyTxId}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                >
                  {copied ? t('copied', language) : t('copy', language)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View on Blockchain Button */}
        {transaction.txid && (
          <button
            onClick={handleViewOnBlockchain}
            className="w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium min-h-[44px] touch-manipulation"
          >
            {t('viewOnBlockchain', language)}
          </button>
        )}
      </main>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('unableToConnect', language)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('connectionError', language)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium min-h-[44px] touch-manipulation"
            >
              {t('ok', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
