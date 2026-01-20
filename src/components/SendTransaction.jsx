import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { usePreferences } from '../context/PreferencesContext';
import { createSimulatedTransaction, updateTransactionStatus } from '../services/transactionService';
import { convertCurrencyToBTC, getCurrentPrice, getCurrencySymbol } from '../services/priceService';
import { formatAmount, getUnitLabel, convertSatstoBTC } from '../services/unitService';
import QRScanner from './QRScanner';

const SendTransaction = ({ onClose }) => {
  const { balance, btcPrice, currency, currencySymbol, addSimulatedTransaction, refreshTransactions } = useWallet();
  const { language, unit } = usePreferences();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [amountType, setAmountType] = useState(unit === 'SAT' ? 'SAT' : 'BTC'); // 'BTC', 'SAT', or currency

  // Update amountType when unit changes
  useEffect(() => {
    if (unit === 'SAT' && amountType === 'BTC') {
      setAmountType('SAT');
      setAmount(''); // Reset amount when switching
    } else if (unit === 'BTC' && amountType === 'SAT') {
      setAmountType('BTC');
      setAmount(''); // Reset amount when switching
    }
  }, [unit]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // Calculate amount in BTC
  const amountInBTC = amountType === 'BTC'
    ? parseFloat(amount) || 0
    : amountType === 'SAT'
    ? convertSatstoBTC(parseFloat(amount) || 0)
    : convertCurrencyToBTC(parseFloat(amount) || 0, currency);

  // Calculate fee (0.0001 BTC)
  const fee = 0.0001;
  const totalAmount = amountInBTC + fee;

  const handleSend = async () => {
    setError('');

    // Validation
    if (!recipient.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (totalAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    // Basic Bitcoin address validation
    const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
    if (!btcAddressRegex.test(recipient.trim())) {
      setError('Invalid Bitcoin address format');
      return;
    }

    setSending(true);

    try {
      // Create simulated transaction
      const tx = createSimulatedTransaction(recipient.trim(), amountInBTC, fee);
      
      // Update context
      addSimulatedTransaction(tx);
      refreshTransactions();

      // Clear form
      setRecipient('');
      setAmount('');

      // Close modal if provided
      if (onClose) {
        onClose();
      }

      // Schedule confirmation after 1 minute
      setTimeout(() => {
        updateTransactionStatus(tx.txid, 'confirmed', 6);
        refreshTransactions();
      }, 60000); // 60 seconds

      setSending(false);
    } catch (err) {
      console.error('Error sending transaction:', err);
      setError(err.message || 'Failed to send transaction. Please try again.');
      setSending(false);
    }
  };

  const handleQRScan = (scannedAddress) => {
    setRecipient(scannedAddress);
    setShowQRScanner(false);
  };

  const handleAmountChange = (value) => {
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 pb-6 sm:pb-6 mb-4 sm:mb-0">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Send Bitcoin
        </h2>
        <button
          onClick={onClose || (() => {})}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 -mr-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-800 dark:text-red-200 flex-1">{error}</p>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recipient Address
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Bitcoin address or scan QR code"
              className="w-full px-3 sm:px-4 py-3 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base font-mono text-gray-900 dark:text-white min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button
              onClick={() => setShowQRScanner(true)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px] touch-manipulation flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              title="Scan QR Code"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="sm:hidden">Scan QR Code</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              inputMode="decimal"
              className="flex-1 w-full px-3 sm:px-4 py-3 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base sm:text-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <select
              value={amountType}
              onChange={(e) => {
                setAmountType(e.target.value);
                setAmount(''); // Reset amount when switching
              }}
              className="w-full sm:w-auto px-3 sm:px-4 py-3 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              {unit === 'SAT' ? (
                <>
                  <option value="SAT">Sats</option>
                  <option value={currency}>{currency}</option>
                </>
              ) : (
                <>
                  <option value="BTC">BTC</option>
                  <option value={currency}>{currency}</option>
                </>
              )}
            </select>
          </div>
          {amount && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {amountType === 'BTC' || amountType === 'SAT'
                ? `≈ ${currencySymbol}${(amountInBTC * btcPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `≈ ${formatAmount(amountInBTC, unit)} ${getUnitLabel(unit)}`
              }
            </p>
          )}
        </div>

        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between text-sm mb-2 sm:mb-2">
            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="text-gray-900 dark:text-white font-mono text-right break-all">{formatAmount(amountInBTC, unit)} {getUnitLabel(unit)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2 sm:mb-2">
            <span className="text-gray-600 dark:text-gray-400">Network Fee:</span>
            <span className="text-gray-900 dark:text-white font-mono text-right">{formatAmount(fee, unit)} {getUnitLabel(unit)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base font-semibold pt-2 sm:pt-2 border-t border-gray-300 dark:border-gray-600">
            <span className="text-gray-900 dark:text-white">Total:</span>
            <span className="text-gray-900 dark:text-white font-mono text-right break-all">{formatAmount(totalAmount, unit)} {getUnitLabel(unit)}</span>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !recipient || !amount || totalAmount > balance}
          className="w-full px-4 py-3.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg active:scale-95 disabled:transform-none min-h-[48px] touch-manipulation text-base font-semibold"
        >
          {sending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Bitcoin'
          )}
        </button>

        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-2">
          Available: {formatAmount(balance, unit)} {getUnitLabel(unit)}
        </p>
      </div>

      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};

export default SendTransaction;
