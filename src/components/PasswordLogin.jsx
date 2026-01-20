import { useState } from 'react';
import { usePassword } from '../context/PasswordContext';

const PasswordLogin = () => {
  const { authenticate } = usePassword();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (value) => {
    // Only allow digits and limit to 4
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
    setPassword(digitsOnly);
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (password.length !== 4) {
      setError('Password must be 4 digits');
      return;
    }

    if (authenticate(password)) {
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/decoylogo.png" alt="Bitcoin Vault" className="h-16 w-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bitcoin Vault</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter 4-digit password"
              maxLength={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 min-h-[44px] text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium min-h-[44px] touch-manipulation"
          >
            Unlock Wallet
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordLogin;
