import { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext'
import { ThemeProvider } from './context/ThemeContext'
import { PreferencesProvider, usePreferences } from './context/PreferencesContext'
import { PasswordProvider, usePassword } from './context/PasswordContext'
import { t } from './services/translations'
import { formatAmountWithUnit } from './services/unitService'
import TransactionList from './components/TransactionList'
import TransactionDetails from './components/TransactionDetails'
import SendTransaction from './components/SendTransaction'
import ReceiveModal from './components/ReceiveModal'
import Settings from './components/Settings'
import PasswordLogin from './components/PasswordLogin'

function AppContent() {
  const { address, balance, currencyValue, currencySymbol, btcPrice, loading } = useWallet();
  const { isAuthenticated } = usePassword();
  const { language, unit } = usePreferences();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Show login screen if password is enabled and user is not authenticated
  if (!isAuthenticated) {
    return <PasswordLogin />;
  }

  // Show settings page if enabled
  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  // Show transaction details if a transaction is selected
  if (selectedTransaction) {
    return <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Dark Blue Header */}
      <header className="bg-blue-900 text-white">
        <div className="px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img src="/decoylogo.png" alt="Bitcoin Vault" className="h-8 w-8 object-contain" />
              <h1 className="text-lg font-semibold">{t('wallet', language)}</h1>
            </div>
            <button 
              onClick={() => setShowReceiveModal(true)}
              className="p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          </div>
          
          {/* Balance Display */}
          {!loading && (
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                {formatAmountWithUnit(balance, unit)}
              </div>
              <div className="text-lg sm:text-xl text-blue-200">
                {currencySymbol}{currencyValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* White Content Area */}
      <main className="bg-white dark:bg-gray-900 pb-20">
        <TransactionList onTransactionClick={setSelectedTransaction} />
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowSendModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 transition-colors z-10 touch-manipulation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modals */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 safe-area-inset-bottom">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <SendTransaction onClose={() => setShowSendModal(false)} />
            </div>
          </div>
        </div>
      )}

      {showReceiveModal && (
        <ReceiveModal
          address={address}
          onClose={() => setShowReceiveModal(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <PasswordProvider>
          <WalletProvider>
            <AppContent />
          </WalletProvider>
        </PasswordProvider>
      </PreferencesProvider>
    </ThemeProvider>
  )
}

export default App
