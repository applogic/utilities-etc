const { calculatePMT } = require('../core/loan-calculations');

/**
 * Calculate Cash-on-Cash Return
 * @param {number} annualCashFlow - Annual cash flow
 * @param {number} downPayment - Down payment amount
 * @returns {number} COCR (as decimal)
 */
function calculateCOCR(annualCashFlow, downPayment) {
  if (!downPayment || downPayment === 0) return 0;
  return annualCashFlow / downPayment;
}

/**
 * Calculate COCR for specific down payment scenario
 * @param {number} propertyPrice - Property price
 * @param {number} annualNOI - Annual Net Operating Income
 * @param {number} downPaymentPercent - Down payment as decimal (e.g., 0.15 for 15%)
 * @param {number} interestRate - Interest rate as decimal
 * @param {number} amortizationYears - Amortization period in years
 * @returns {number} COCR (as decimal)
 */
function calculateCOCRScenario(propertyPrice, annualNOI, downPaymentPercent, interestRate = 0.075, amortizationYears = 30) {
  const downPayment = propertyPrice * downPaymentPercent;
  const loanAmount = propertyPrice * (1 - downPaymentPercent);
  const monthlyPayment = calculatePMT(loanAmount, interestRate, amortizationYears);
  const annualDebtService = monthlyPayment * 12;
  const annualCashFlow = annualNOI - annualDebtService;
  
  return calculateCOCR(annualCashFlow, downPayment);
}

/**
 * Calculate COCR for 15% down scenario
 * @param {number} propertyPrice - Property price
 * @param {number} annualNOI - Annual Net Operating Income
 * @param {number} interestRate - Interest rate as decimal
 * @param {number} amortizationYears - Amortization period in years
 * @returns {number} COCR (as decimal)
 */
function calculateCOCR15(propertyPrice, annualNOI, interestRate = 0.075, amortizationYears = 30) {
  return calculateCOCRScenario(propertyPrice, annualNOI, 0.15, interestRate, amortizationYears);
}

/**
 * Calculate COCR for 30% down scenario
 * @param {number} propertyPrice - Property price
 * @param {number} annualNOI - Annual Net Operating Income
 * @param {number} interestRate - Interest rate as decimal
 * @param {number} amortizationYears - Amortization period in years
 * @returns {number} COCR (as decimal)
 */
function calculateCOCR30(propertyPrice, annualNOI, interestRate = 0.075, amortizationYears = 30) {
  return calculateCOCRScenario(propertyPrice, annualNOI, 0.30, interestRate, amortizationYears);
}

module.exports = {
  calculateCOCR,
  calculateCOCRScenario,
  calculateCOCR15,
  calculateCOCR30
};