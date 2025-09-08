import { calculatePMT } from '../core/loan-calculations.js';

/**
 * Calculate monthly cash flow
 * @param {number} monthlyNOI - Monthly Net Operating Income
 * @param {number} loanAmount - Loan amount
 * @param {number} interestRate - Annual interest rate (as decimal)
 * @param {number} amortizationYears - Amortization period in years
 * @returns {number} Monthly cash flow
 */
function calculateCashFlow(monthlyNOI, loanAmount, interestRate, amortizationYears) {
  const monthlyPayment = calculatePMT(loanAmount, interestRate, amortizationYears);
  return monthlyNOI - monthlyPayment;
}

/**
 * Calculate cash flow yield as percentage of property price
 * @param {number} annualCashFlow - Annual cash flow
 * @param {number} propertyPrice - Property price
 * @returns {number} Cash flow yield (as decimal)
 */
function calculateCashFlowYield(annualCashFlow, propertyPrice) {
  if (!propertyPrice || propertyPrice === 0) return 0;
  return annualCashFlow / propertyPrice;
}

/**
 * Calculate cap rate
 * @param {number} annualNOI - Annual Net Operating Income
 * @param {number} propertyPrice - Property price
 * @returns {number} Cap rate (as decimal)
 */
function calculateCapRate(annualNOI, propertyPrice) {
  if (!propertyPrice || propertyPrice === 0) return 0;
  return annualNOI / propertyPrice;
}

export {
  calculateCashFlow,
  calculateCashFlowYield,
  calculateCapRate
};