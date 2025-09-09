/**
 * Main entry point for @archerjessop/utilities-etc
 * Centrally managed business logic and utilities
 */

// ========================================
// CONFIGURATION (Centralized Business Rules)
// ========================================
export { REAL_ESTATE_RULES, VALIDATION_RULES } from "./config/real-estate-rules.js";

// ========================================
// CENTRALIZED REAL ESTATE CALCULATIONS
// ========================================
export {
  calculateNOIByPropertyType,
  calculateInvestmentAnalysis,
  calculateFormattedInvestmentAnalysis,
  calculatePriceForTargetCOCR,
  calculatePriceFor15PercentCOCR,
  calculateCOCRWith30PercentDown,
  extractBedroomsWithDefault,
  validatePropertyAnalysisInputs
} from "./calculations/real-estate/investment-analysis.js";

// ========================================
// CORE CALCULATION UTILITIES
// ========================================
export { formatCurrency, formatNumber, formatPercentage, formatPriceValue } from "./calculations/core/formatting.js";
export { calculateInterestOverTime, calculatePMT, calculateRemainingBalance } from "./calculations/core/loan-calculations.js";
export { calculateRemainingBalance as calculateBalloonBalance } from "./calculations/core/loan-calculations.js";



// ========================================
// DATE UTILITIES
// ========================================
export { calculateDOM, calculateTimeDifference } from "./calculations/date/calculations.js";

// ========================================
// EXISTING REAL ESTATE UTILITIES (for backwards compatibility)
// ========================================
export { calculateAppreciation } from "./calculations/real-estate/appreciation.js";
export { calculateCapRate, calculateCashFlow, calculateCashFlowYield } from "./calculations/real-estate/cash-flow.js";
export { calculateNetToBuyer } from "./calculations/real-estate/costs.js";
export { calculateCOCR, calculateCOCR15, calculateCOCR30, calculateCOCRScenario } from "./calculations/real-estate/returns.js";

// ========================================
// BUSINESS UTILITIES
// ========================================
export { calculateCompoundGrowth, calculateNPV, calculatePresentValue } from "./calculations/business/projections.js";
export { calculateCurrentRatio, calculateROE, calculateROI } from "./calculations/business/ratios.js";

// ========================================
// DOM UTILITIES
// ========================================
export { extractBedrooms, extractEmail, extractPhoneNumber, extractPrice } from "./dom-utilities/extraction/text-extraction.js";
export { validateDate, validateEmail, validatePhoneNumber } from "./dom-utilities/validation/validators.js";

// ========================================
// VERSION INFO
// ========================================
export const VERSION = "3.0.0"; // Bump to 2.0.0 for centralized business rules
