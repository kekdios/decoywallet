import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../context/PreferencesContext';
import { usePassword } from '../context/PasswordContext';
import { t } from '../services/translations';

const Settings = ({ onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, currency, setCurrency, unit, setUnit } = usePreferences();
  const translations = (key) => t(key, language);
  const { isPasswordEnabled, togglePassword, setPassword } = usePassword();
  const [passphraseCopied, setPassphraseCopied] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Fixed passphrase - always the same 12 words
  const passphrase = 'stone language lesson patient vessel hat bid gravity wisdom subject million evidence';

  const handleCopyPassphrase = () => {
    navigator.clipboard.writeText(passphrase);
    setPassphraseCopied(true);
    setTimeout(() => setPassphraseCopied(false), 2000);
  };

  const handlePasswordToggle = (enabled) => {
    togglePassword(enabled);
    if (enabled) {
      setShowPasswordSection(true);
    } else {
      setPasswordInput('');
      setConfirmPassword('');
      setPasswordError('');
      setShowPasswordSection(false);
      setPassword(''); // Clear password
    }
  };

  const handleSetPassword = () => {
    setPasswordError('');
    
    if (!passwordInput) {
      setPasswordError('Please enter a password');
      return;
    }

    // Password must be exactly 4 digits
    if (!/^\d{4}$/.test(passwordInput)) {
      setPasswordError('Password must be exactly 4 numbers');
      return;
    }

    if (passwordInput !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPassword(passwordInput);
    setPasswordInput('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPasswordSection(false);
  };

  const handlePasswordInputChange = (value) => {
    // Only allow digits and limit to 4
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
    setPasswordInput(digitsOnly);
  };

  const handleConfirmPasswordInputChange = (value) => {
    // Only allow digits and limit to 4
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
    setConfirmPassword(digitsOnly);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-blue-900 text-white">
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
              <h1 className="text-lg font-semibold">{translations('settings')}</h1>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <main className="px-4 py-6">
        {/* Preferences */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{translations('preferences')}</h2>
          
          {/* Dark Mode */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{translations('darkMode')}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{translations('toggleDarkTheme')}</div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-blue-900' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Password Protection */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{translations('passwordProtection')}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{translations('requirePassword')}</div>
              </div>
              <button
                onClick={() => handlePasswordToggle(!isPasswordEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPasswordEnabled ? 'bg-blue-900' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPasswordEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {isPasswordEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                {!showPasswordSection ? (
                  <button
                    onClick={() => setShowPasswordSection(true)}
                    className="w-full px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                  >
                    {isPasswordEnabled && !passwordInput ? translations('setPassword') : translations('changePassword')}
                  </button>
                ) : (
                  <div className="space-y-3">
                    {passwordError && (
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-800 dark:text-red-200">
                        {passwordError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {translations('newPassword')}
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={passwordInput}
                        onChange={(e) => handlePasswordInputChange(e.target.value)}
                        placeholder="Enter 4-digit password"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {translations('confirmPassword')}
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordInputChange(e.target.value)}
                        placeholder="Confirm 4-digit password"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-h-[44px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSetPassword}
                        className="flex-1 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                      >
                        {translations('save')}
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordSection(false);
                          setPasswordInput('');
                          setConfirmPassword('');
                          setPasswordError('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                      >
                        {translations('cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {translations('language')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm min-h-[44px] touch-manipulation"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          {/* Currency Selection */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {translations('currency')}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm min-h-[44px] touch-manipulation"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="BRL">BRL - Brazilian Real</option>
              <option value="KRW">KRW - South Korean Won</option>
              <option value="MXN">MXN - Mexican Peso</option>
            </select>
          </div>

          {/* BTC/Satoshi Selection */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {translations('bitcoinUnit')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setUnit('BTC')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium min-h-[44px] touch-manipulation ${
                  unit === 'BTC'
                    ? 'bg-blue-900 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600'
                }`}
              >
                BTC
              </button>
              <button
                onClick={() => setUnit('SAT')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium min-h-[44px] touch-manipulation ${
                  unit === 'SAT'
                    ? 'bg-blue-900 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600'
                }`}
              >
                Satoshi
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{translations('security')}</h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{translations('recoveryPassphrase')}</label>
            <div className="mb-3">
              {showPassphrase ? (
                <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-3 mb-2">
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-words">{passphrase}</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-3 mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
              >
            {showPassphrase ? translations('hide') : translations('show')}
          </button>
          <button
            onClick={handleCopyPassphrase}
            className="flex-1 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
          >
            {passphraseCopied ? translations('copied') : translations('copy')}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {translations('keepSecure')}
        </p>
          </div>
        </div>

        {/* About */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{translations('about')}</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Bitcoin Vault</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {translations('version')} 1.0.0
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
