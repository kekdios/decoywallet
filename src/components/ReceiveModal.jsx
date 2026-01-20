import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ReceiveModal = ({ address, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 my-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Receive Bitcoin
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 -mr-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center mb-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
            <QRCodeSVG value={address || ''} size={typeof window !== 'undefined' ? Math.min(200, window.innerWidth - 80) : 200} />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 text-center px-2">
            Scan this QR code to receive Bitcoin
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={address || ''}
              readOnly
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm font-mono text-gray-900 dark:text-white break-all min-h-[44px]"
            />
            <button
              onClick={handleCopy}
              className="px-4 sm:px-5 py-2.5 sm:py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors text-sm sm:text-base font-medium min-h-[44px] touch-manipulation"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 sm:px-5 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium min-h-[44px] touch-manipulation"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReceiveModal;
