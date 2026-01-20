// Unit conversion service for BTC and Satoshis
// 1 BTC = 100,000,000 satoshis

export const BTC_TO_SAT = 100000000;

export const convertBTCtoSats = (btcAmount) => {
  return Math.round(btcAmount * BTC_TO_SAT);
};

export const convertSatstoBTC = (satsAmount) => {
  return satsAmount / BTC_TO_SAT;
};

export const formatAmount = (btcAmount, unit = 'BTC') => {
  if (unit === 'SAT') {
    const sats = convertBTCtoSats(btcAmount);
    // Format satoshis with commas for readability
    return sats.toLocaleString('en-US');
  }
  // Format BTC with 8 decimal places
  return btcAmount.toFixed(8);
};

export const getUnitLabel = (unit = 'BTC') => {
  return unit === 'SAT' ? 'sats' : 'BTC';
};

export const formatAmountWithUnit = (btcAmount, unit = 'BTC') => {
  const formatted = formatAmount(btcAmount, unit);
  const label = getUnitLabel(unit);
  return `${formatted} ${label}`;
};
