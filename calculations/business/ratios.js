/**
 * Common business financial ratios
 */

/**
 * Calculate Return on Investment
 * @param {number} gain - Gain from investment
 * @param {number} cost - Cost of investment
 * @returns {number} ROI (as decimal)
 */
function calculateROI(gain, cost) {
  if (cost === 0) return 0;
  return (gain - cost) / cost;
}

/**
 * Calculate Return on Equity
 * @param {number} netIncome - Net income
 * @param {number} shareholderEquity - Shareholder equity
 * @returns {number} ROE (as decimal)
 */
function calculateROE(netIncome, shareholderEquity) {
  if (shareholderEquity === 0) return 0;
  return netIncome / shareholderEquity;
}

/**
 * Calculate Current Ratio
 * @param {number} currentAssets - Current assets
 * @param {number} currentLiabilities - Current liabilities
 * @returns {number} Current ratio
 */
function calculateCurrentRatio(currentAssets, currentLiabilities) {
  if (currentLiabilities === 0) return 0;
  return currentAssets / currentLiabilities;
}

export {
  calculateROI,
  calculateROE,
  calculateCurrentRatio
};