import { createContext, useContext, useState, useEffect } from 'react';

const PasswordContext = createContext();

export const usePassword = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePassword must be used within a PasswordProvider');
  }
  return context;
};

export const PasswordProvider = ({ children }) => {
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(() => {
    const saved = localStorage.getItem('bitcoinVault_passwordEnabled');
    return saved === 'true';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // If password is not enabled, user is always authenticated
    const enabled = localStorage.getItem('bitcoinVault_passwordEnabled') === 'true';
    const hasPassword = localStorage.getItem('bitcoinVault_passwordHash');
    // If password is enabled but no password is set yet, allow access
    return !enabled || !hasPassword;
  });

  const [storedPasswordHash, setStoredPasswordHash] = useState(() => {
    return localStorage.getItem('bitcoinVault_passwordHash') || '';
  });

  // Simple hash function (not cryptographically secure, but fine for a decoy wallet)
  const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  };

  const setPassword = (password) => {
    if (password) {
      const hash = hashPassword(password);
      setStoredPasswordHash(hash);
      localStorage.setItem('bitcoinVault_passwordHash', hash);
      setIsPasswordEnabled(true);
      localStorage.setItem('bitcoinVault_passwordEnabled', 'true');
      // Keep user authenticated after setting password (they just set it)
      setIsAuthenticated(true);
    } else {
      // Remove password
      setStoredPasswordHash('');
      localStorage.removeItem('bitcoinVault_passwordHash');
      setIsPasswordEnabled(false);
      localStorage.setItem('bitcoinVault_passwordEnabled', 'false');
      setIsAuthenticated(true);
    }
  };

  const verifyPassword = (password) => {
    if (!isPasswordEnabled) return true;
    const hash = hashPassword(password);
    return hash === storedPasswordHash;
  };

  const authenticate = (password) => {
    if (verifyPassword(password)) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (isPasswordEnabled) {
      setIsAuthenticated(false);
    }
  };

  const togglePassword = (enabled) => {
    setIsPasswordEnabled(enabled);
    localStorage.setItem('bitcoinVault_passwordEnabled', enabled.toString());
    if (!enabled) {
      setStoredPasswordHash('');
      localStorage.removeItem('bitcoinVault_passwordHash');
      setIsAuthenticated(true);
    } else {
      // Only require authentication if password is actually set
      const hasPassword = localStorage.getItem('bitcoinVault_passwordHash');
      setIsAuthenticated(!hasPassword);
    }
  };

  return (
    <PasswordContext.Provider value={{
      isPasswordEnabled,
      isAuthenticated,
      setPassword,
      verifyPassword,
      authenticate,
      logout,
      togglePassword,
    }}>
      {children}
    </PasswordContext.Provider>
  );
};
