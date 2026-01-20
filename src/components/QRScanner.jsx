import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onClose }) => {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const startScanning = async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = html5QrCode;

        const qrBoxSize = typeof window !== 'undefined' ? Math.min(250, window.innerWidth - 80) : 250;
        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: qrBoxSize, height: qrBoxSize },
          },
          (decodedText) => {
            onScanSuccess(decodedText);
            stopScanning();
          },
          (errorMessage) => {
            // Ignore scanning errors
          }
        );
        setScanning(true);
      } catch (err) {
        console.error('Error starting QR scanner:', err);
        setError('Failed to start camera. Please check permissions.');
      }
    };

    startScanning();

    return () => {
      stopScanning();
    };
  }, [onScanSuccess]);

  const stopScanning = async () => {
    if (html5QrCodeRef.current && scanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 my-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Scan QR Code
          </h3>
          <button
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 -mr-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div id="qr-reader" className="mb-4 w-full"></div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800 dark:text-red-200 flex-1">{error}</p>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          Point your camera at a Bitcoin address QR code
        </p>

        <button
          onClick={() => {
            stopScanning();
            onClose();
          }}
          className="w-full px-4 sm:px-5 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium min-h-[44px] touch-manipulation"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
