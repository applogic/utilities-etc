/**
 * Core loan calculation functions
 */

/**
 * Calculate monthly payment for a loan (PMT function)
 * @param {number} principal - Loan principal amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} years - Loan term in years
 * @returns {number} Monthly payment amount
 */
function calculatePMT(principal, annualRate, years) {
  if (annualRate === 0) {
    return principal / (years * 12);
  }
  
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  const pmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
              (Math.pow(1 + monthlyRate, numPayments) - 1);
  return pmt;
}

/**
 * Calculate remaining balance on a loan
 * @param {number} principal - Original loan amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} totalYears - Total loan term in years
 * @param {number} yearsPaid - Years already paid
 * @returns {number} Remaining balance
 */
function calculateRemainingBalance(principal, annualRate, totalYears, yearsPaid) {
  if (annualRate === 0) {
    const monthlyPrincipal = principal / (totalYears * 12);
    const totalPaid = monthlyPrincipal * yearsPaid * 12;
    return Math.max(0, principal - totalPaid);
  }

  const monthlyRate = annualRate / 12;
  const totalPayments = totalYears * 12;
  const paymentsMade = yearsPaid * 12;
  
  const remainingBalance = principal * (
    (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, paymentsMade)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );
  
  return Math.max(0, remainingBalance);
}

/**
 * Calculate total interest paid over life of loan
 * @param {number} principal - Loan principal amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} years - Loan term in years
 * @returns {number} Total interest paid
 */
function calculateInterestOverTime(principal, annualRate, years) {
  const monthlyPayment = calculatePMT(principal, annualRate, years);
  const totalPaid = monthlyPayment * years * 12;
  return totalPaid - principal;
}

module.exports = {
  calculatePMT,
  calculateRemainingBalance,
  calculateInterestOverTime
};