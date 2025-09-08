/**
 * Calculate property appreciation scenarios
 * @param {number} currentPrice - Current property price
 * @param {number} appreciationRate - Annual appreciation rate (as decimal)
 * @param {number} years - Number of years
 * @param {number} balloonBalance - Outstanding balloon balance
 * @param {number} dscrBalance - Outstanding DSCR balance
 * @param {number} refiPercent - Refinance percentage (as decimal)
 * @returns {Object} Appreciation analysis
 */
function calculateAppreciation(currentPrice, appreciationRate, years, balloonBalance = 0, dscrBalance = 0, refiPercent = 0.70) {
  const futureValue = currentPrice * Math.pow(1 + appreciationRate, years);
  const refiAmount = futureValue * refiPercent;
  const totalOwing = balloonBalance + dscrBalance;
  const cashOutAfterRefi = refiAmount - totalOwing;

  return {
    futureValue,
    refiAmount,
    totalOwing,
    cashOutAfterRefi
  };
}

module.exports = {
  calculateAppreciation
};