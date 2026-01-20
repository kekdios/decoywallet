// Price service for fetching Bitcoin price in multiple currencies
let currentPrices = { usd: 50000 }; // Default fallback
let priceUpdateInterval = null;

// Currency exchange rates (fallback if API fails)
const exchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.0,
  CNY: 7.2,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.88,
  INR: 83.0,
  BRL: 4.95,
  KRW: 1300.0,
  MXN: 17.0,
};

export const fetchBitcoinPrice = async (currency = 'USD') => {
  try {
    const currencyLower = currency.toLowerCase();
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencyLower}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Bitcoin price');
    }
    const data = await response.json();
    const price = data.bitcoin[currencyLower];
    if (price) {
      currentPrices[currencyLower] = price;
      return price;
    }
    // Fallback to USD and convert
    if (currencyLower !== 'usd') {
      const usdResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      if (usdResponse.ok) {
        const usdData = await usdResponse.json();
        const usdPrice = usdData.bitcoin.usd;
        currentPrices.usd = usdPrice;
        // Convert using exchange rate
        const rate = exchangeRates[currency] || 1;
        const convertedPrice = usdPrice * rate;
        currentPrices[currencyLower] = convertedPrice;
        return convertedPrice;
      }
    }
    throw new Error('Price not available');
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    // Use fallback with exchange rate
    const usdPrice = currentPrices.usd || 50000;
    const rate = exchangeRates[currency] || 1;
    const fallbackPrice = usdPrice * rate;
    currentPrices[currency.toLowerCase()] = fallbackPrice;
    return fallbackPrice;
  }
};

export const convertBTCtoCurrency = (btcAmount, currency = 'USD') => {
  const currencyLower = currency.toLowerCase();
  const price = currentPrices[currencyLower] || (currentPrices.usd * (exchangeRates[currency] || 1));
  return btcAmount * price;
};

export const convertCurrencyToBTC = (amount, currency = 'USD') => {
  const currencyLower = currency.toLowerCase();
  const price = currentPrices[currencyLower] || (currentPrices.usd * (exchangeRates[currency] || 1));
  if (!price) return 0;
  return amount / price;
};

// Legacy functions for backward compatibility
export const convertBTCtoUSD = (btcAmount) => convertBTCtoCurrency(btcAmount, 'USD');
export const convertUSDtoBTC = (usdAmount) => convertCurrencyToBTC(usdAmount, 'USD');

export const startPriceUpdates = (callback, currency = 'USD', intervalMs = 30000) => {
  // Fetch immediately
  fetchBitcoinPrice(currency).then((price) => {
    callback(price, currency);
  });
  
  // Then update every interval
  priceUpdateInterval = setInterval(async () => {
    const price = await fetchBitcoinPrice(currency);
    callback(price, currency);
  }, intervalMs);
  
  return () => {
    if (priceUpdateInterval) {
      clearInterval(priceUpdateInterval);
      priceUpdateInterval = null;
    }
  };
};

export const stopPriceUpdates = () => {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
    priceUpdateInterval = null;
  }
};

export const getCurrentPrice = (currency = 'USD') => {
  const currencyLower = currency.toLowerCase();
  return currentPrices[currencyLower] || (currentPrices.usd * (exchangeRates[currency] || 1));
};

// Get currency symbol
export const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    INR: '₹',
    BRL: 'R$',
    KRW: '₩',
    MXN: '$',
  };
  return symbols[currency] || currency;
};
