/**
 * Core formatting utilities for financial values
 */

/**
 * Format currency values with K/M notation
 * @param {number} amount - Amount to format
 * @param {boolean} isMonthly - Whether this is a monthly payment (affects formatting)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, isMonthly = false) {
  if (isNaN(amount) || !isFinite(amount)) return "N/A";
  
  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;
  const prefix = isNegative ? "-$" : "$";
  
  if (isMonthly) {
    // For monthly payments, show full amount with commas
    return prefix + absAmount.toLocaleString("en-US", { maximumFractionDigits: 0 });
  } else {
    // For larger amounts, use K/M notation with 2-3 decimal places as needed
    if (absAmount >= 1000000) {
      const millions = absAmount / 1000000;
      const formatted = millions.toFixed(3).replace(/\.?0+$/, "");
      return prefix + formatted + "M";
    } else if (absAmount >= 1000) {
      const thousands = absAmount / 1000;
      const formatted = thousands.toFixed(3).replace(/\.?0+$/, "");
      return prefix + formatted + "K";
    } else {
      return prefix + absAmount.toLocaleString("en-US", { maximumFractionDigits: 0 });
    }
  }
}

/**
 * Format percentage values
 * @param {number} value - Decimal value (e.g., 0.065 for 6.5%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, decimals = 1) {
  if (isNaN(value) || !isFinite(value)) return "N/A";
  return (value * 100).toFixed(decimals) + "%";
}

/**
 * Format number with commas and decimals
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
function formatNumber(value, decimals = 2) {
  if (isNaN(value) || !isFinite(value)) return "N/A";
  return value.toLocaleString("en-US", { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
}

/**
 * Format price value for display
 * @param {number} price - Price value 
 * @returns {string} Formatted price string
 */
function formatPriceValue(price) {
  if (!price || isNaN(price)) return "N/A";
  
  const absPrice = Math.abs(price);
  
  if (absPrice >= 1000000) {
    const millions = absPrice / 1000000;
    return "$" + millions.toFixed(0) + "M";
  } else if (absPrice >= 1000) {
    const thousands = absPrice / 1000;
    return "$" + thousands.toFixed(0) + "K";
  } else {
    return "$" + price.toLocaleString();
  }
}

export {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPriceValue,
};