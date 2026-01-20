import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('bitcoinVault_theme');
    if (saved) {
      return saved === 'dark';
    }
    // Default to light mode if no preference saved
    return false;
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('bitcoinVault_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('bitcoinVault_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Apply immediately for instant feedback
    const root = document.documentElement;
    if (newIsDark) {
      root.classList.add('dark');
      localStorage.setItem('bitcoinVault_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('bitcoinVault_theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
