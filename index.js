/**
 * Main entry point for @archerjessop/utilities-etc
 */

// Business utilities
import { calculateCompoundGrowth, calculateNPV, calculatePresentValue } from "./calculations/business/projections.js";
import { calculateCurrentRatio, calculateROE, calculateROI } from "./calculations/business/ratios.js";

// Core calculation utilities
import { formatCurrency, formatNumber, formatPercentage, formatPriceValue } from "./calculations/core/formatting.js";
import { calculateInterestOverTime, calculatePMT, calculateRemainingBalance } from "./calculations/core/loan-calculations.js";

// Date utilities
import { calculateDOM, calculateTimeDifference } from "./calculations/date/calculations.js";

// Real estate utilities
import { calculateAppreciation } from "./calculations/real-estate/appreciation.js";
import { calculateCapRate, calculateCashFlow, calculateCashFlowYield } from "./calculations/real-estate/cash-flow.js";
import { calculateNetToBuyer } from "./calculations/real-estate/costs.js";
import { calculateCOCR, calculateCOCR15, calculateCOCR30, calculateCOCRScenario } from "./calculations/real-estate/returns.js";

// DOM utilities
import { extractBedrooms, extractEmail, extractPhoneNumber, extractPrice } from "./dom-utilities/extraction/text-extraction.js";
import { validateDate, validateEmail, validatePhoneNumber } from "./dom-utilities/validation/validators.js";

// Export everything
export {
  calculateAppreciation,
  calculateRemainingBalance as calculateBalloonBalance, // Alias for common usage
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