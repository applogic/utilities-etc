/**
 * Business projection calculations
 */

/**
 * Calculate compound growth
 * @param {number} initialValue - Initial value
 * @param {number} growthRate - Growth rate (as decimal)
 * @param {number} periods - Number of periods
 * @returns {number} Future value
 */
function calculateCompoundGrowth(initialValue, growthRate, periods) {
  return initialValue * Math.pow(1 + growthRate, periods);
}

/**
 * Calculate present value
 * @param {number} futureValue - Future value
 * @param {number} discountRate - Discount rate (as decimal)
 * @param {number} periods - Number of periods
 * @returns {number} Present value
 */
function calculatePresentValue(futureValue, discountRate, periods) {
  return futureValue / Math.pow(1 + discountRate, periods);
}

/**
 * Calculate Net Present Value
 * @param {number[]} cashFlows - Array of cash flows
 * @param {number} discountRate - Discount rate (as decimal)
 * @param {number} initialInvestment - Initial investment amount
 * @returns {number} Net Present Value
 */
function calculateNPV(cashFlows, discountRate, initialInvestment = 0) {
  const npv = cashFlows.reduce((total, cashFlow, index) => {
    return total + calculatePresentValue(cashFlow, discountRate, index + 1);
  }, 0);
  
  return npv - initialInvestment;
}

module.exports = {
  calculateCompoundGrowth,
  calculatePresentValue,
  calculateNPV
};