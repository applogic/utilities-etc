/**
 * Calculate net to buyer with all associated costs
 * @param {number} propertyPrice - Property price
 * @param {number} downPaymentPercent - Down payment as decimal (e.g., 0.25 for 25%)
 * @param {Object} constants - Cost constants object
 * @returns {Object} Cost breakdown
 */
function calculateNetToBuyer(propertyPrice, downPaymentPercent, constants = {}) {
  const {
    sellerAgentCommission = 0.025,
    buyerAgentCommission = 0,
    closing = 0.0125,
    bridge = 0.03,
    rehab = 0,
    assignmentFee = 0.03
  } = constants;

  const downPayment = propertyPrice * downPaymentPercent;
  const sellerCommission = propertyPrice * sellerAgentCommission;
  const buyerCommission = propertyPrice * buyerAgentCommission;
  const closingCosts = propertyPrice * closing;
  const bridgeCosts = propertyPrice * bridge;
  const rehabCosts = propertyPrice * rehab;
  const assignmentCosts = propertyPrice * assignmentFee;

  const totalCosts = sellerCommission + buyerCommission + closingCosts + bridgeCosts + rehabCosts + assignmentCosts;
  const netToBuyer = downPayment + totalCosts;

  return {
    downPayment,
    sellerCommission,
    buyerCommission,
    closingCosts,
    bridgeCosts,
    rehabCosts,
    assignmentCosts,
    totalCosts,
    netToBuyer,
    breakdown: {
      "Down Payment": downPayment,
      "Seller Commission": sellerCommission,
      "Buyer Commission": buyerCommission,
      "Closing Costs": closingCosts,
      "Bridge Loan": bridgeCosts,
      "Rehab": rehabCosts,
      "Assignment Fee": assignmentCosts
    }
  };
}

module.exports = {
  calculateNetToBuyer
};