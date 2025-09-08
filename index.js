/**
 * Main entry point for @archerjessop/utilities-etc
 */

// Business utilities
const { calculateCompoundGrowth, calculateNPV, calculatePresentValue } = require("./calculations/business/projections");
const { calculateCurrentRatio, calculateROE, calculateROI } = require("./calculations/business/ratios");

// Core calculation utilities
const { formatCurrency, formatNumber, formatPercentage, formatPriceValue } = require("./calculations/core/formatting");
const { calculateInterestOverTime, calculatePMT, calculateRemainingBalance } = require("./calculations/core/loan-calculations");

// Date utilities
const { calculateDOM, calculateTimeDifference } = require("./calculations/date/calculations");

// Real estate utilities
const { calculateAppreciation } = require("./calculations/real-estate/appreciation");
const { calculateCapRate, calculateCashFlow, calculateCashFlowYield } = require("./calculations/real-estate/cash-flow");
const { calculateNetToBuyer } = require("./calculations/real-estate/costs");
const { calculateCOCR, calculateCOCR15, calculateCOCR30, calculateCOCRScenario } = require("./calculations/real-estate/returns");

// DOM utilities
const { extractBedrooms, extractEmail, extractPhoneNumber, extractPrice } = require("./dom-utilities/extraction/text-extraction");
const { validateDate, validateEmail, validatePhoneNumber } = require("./dom-utilities/validation/validators");

// Export everything
module.exports = {
  calculateAppreciation,
  calculateBalloonBalance: calculateRemainingBalance, // Alias for common usage
  calculateCapRate,
  calculateCashFlow,
  calculateCashFlowYield,
  calculateCOCR,
  calculateCOCR15,
  calculateCOCR30,
  calculateCOCRScenario,
  calculateCompoundGrowth,
  calculateCurrentRatio,
  calculateDOM,
  calculateInterestOverTime,
  calculateNetToBuyer,
  calculateNPV,
  calculatePMT,
  calculatePresentValue,
  calculateRemainingBalance,
  calculateROE,
  calculateROI,
  calculateTimeDifference,
  extractBedrooms,
  extractEmail,
  extractPhoneNumber,
  extractPrice,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPriceValue,
  validateDate,
  validateEmail,
  validatePhoneNumber
};