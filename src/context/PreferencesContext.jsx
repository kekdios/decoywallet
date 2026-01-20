import { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('bitcoinVault_language');
    return saved || 'en';
  });

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('bitcoinVault_currency');
    return saved || 'USD';
  });

  const [unit, setUnit] = useState(() => {
    const saved = localStorage.getItem('bitcoinVault_unit');
    return saved || 'BTC';
  });

  useEffect(() => {
    localStorage.setItem('bitcoinVault_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('bitcoinVault_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('bitcoinVault_unit', unit);
  }, [unit]);

  return (
    <PreferencesContext.Provider value={{
      language,
      setLanguage,
      currency,
      setCurrency,
      unit,
      setUnit,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};
