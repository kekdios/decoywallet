import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';
import ReceiveModal from './ReceiveModal';

const WalletDisplay = () => {
  const { address, balance, usdValue, loading, error, loadWallet, refreshTransactions } = useWallet();
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-12 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-200 font-medium mb-2">{error}</p>
            <button
              onClick={async () => {
                setRefreshing(true);
                await loadWallet();
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="px-4 sm:px-5 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium min-h-[44px] touch-manipulation"
            >
              {refreshing ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Wallet Balance
          </h2>
          <button
            onClick={async () => {
              setRefreshing(true);
              await refreshTransactions();
              setRefreshing(false);
            }}
            disabled={refreshing}
            className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
            title="Refresh"
          >
            <svg 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-4 sm:p-6 border border-orange-200 dark:border-orange-800">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 break-all">
            <span className="text-orange-500 flex-shrink-0">₿</span>
            <span className="break-all">{balance.toFixed(8)} BTC</span>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300 break-all">
            ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wallet Address
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={address || ''}
              readOnly
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm font-mono text-gray-900 dark:text-white break-all"
            />
            <button
              onClick={copyAddress}
              className="px-4 sm:px-5 py-2.5 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium min-h-[44px] touch-manipulation"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => setShowReceiveModal(true)}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-md hover:shadow-lg active:scale-95 min-h-[44px] touch-manipulation"
          >
            <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Receive
            </span>
          </button>
        </div>
      </div>

      {showReceiveModal && (
        <ReceiveModal
          address={address}
          onClose={() => setShowReceiveModal(false)}
        />
      )}
    </>
  );
};

export default WalletDisplay;
