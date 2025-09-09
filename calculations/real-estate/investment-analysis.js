// calculations/real-estate/investment-analysis.js in utilities-etc package

import { REAL_ESTATE_RULES, VALIDATION_RULES } from '../../config/real-estate-rules.js';
import { calculatePMT } from '../core/loan-calculations.js';
import { formatCurrency, formatPercentage } from '../core/formatting.js';
import { extractBedrooms } from '../../dom-utilities/extraction/text-extraction.js';

/**
 * Calculate NOI based on property type using centralized rules
 * @param {number} askingPrice - Property asking price
 * @param {number} capRate - Cap rate (as decimal, e.g., 0.075 for 7.5%)
 * @param {string} propertyType - 'multifamily', 'assisted', or 'str'
 * @param {number|null} bedroomCount - Number of bedrooms (null = extract from DOM)
 * @param {number|null} strGrossIncome - STR gross income if available
 * @returns {number} Annual NOI
 */
export function calculateNOIByPropertyType(askingPrice, capRate, propertyType = 'multifamily', bedroomCount = null, strGrossIncome = null) {
  // Validate inputs
  if (askingPrice < VALIDATION_RULES.price.minimum || askingPrice > VALIDATION_RULES.price.maximum) {
    throw new Error(`Price must be between $${VALIDATION_RULES.price.minimum} and $${VALIDATION_RULES.price.maximum}`);
  }
  
  if (capRate < VALIDATION_RULES.capRate.minimum || capRate > VALIDATION_RULES.capRate.maximum) {
    throw new Error(`Cap rate must be between ${VALIDATION_RULES.capRate.minimum * 100}% and ${VALIDATION_RULES.capRate.maximum * 100}%`);
  }

  switch (propertyType) {
    case 'assisted':
      const bedrooms = bedroomCount || extractBedrooms() || REAL_ESTATE_RULES.defaults.bedroomCount;
      const { revenuePerBedroomPerMonth, monthsPerYear } = REAL_ESTATE_RULES.propertyIncome.assistedLiving;
      return bedrooms * revenuePerBedroomPerMonth * monthsPerYear;
      
    case 'str':
      const { netIncomeAfterExpensesPercent, fallbackGrossYieldEstimate } = REAL_ESTATE_RULES.propertyIncome.shortTermRental;
      
      if (strGrossIncome && strGrossIncome > 0) {
        return strGrossIncome * netIncomeAfterExpensesPercent;
      }
      
      // Fallback calculation if no STR data
      const estimatedGrossIncome = askingPrice * fallbackGrossYieldEstimate;
      return estimatedGrossIncome * netIncomeAfterExpensesPercent;
      
    case 'multifamily':
    default:
      return askingPrice * capRate;
  }
}

/**
 * Calculate complete investment metrics using centralized rules
 * @param {object} params
 * @param {number} params.askingPrice - Property asking price
 * @param {number} params.noi - Annual Net Operating Income
 * @param {number} [params.downPaymentPercent] - Override default down payment %
 * @param {number} [params.dscrPercent] - Override default DSCR %
 * @param {number} [params.sellerFinancingPercent] - Override default seller financing %
 * @returns {object} Complete investment analysis
 */
export function calculateInvestmentAnalysis({
  askingPrice,
  noi,
  downPaymentPercent = REAL_ESTATE_RULES.financing.defaultDownPaymentPercent,
  dscrPercent = REAL_ESTATE_RULES.financing.defaultDSCRPercent,
  sellerFinancingPercent = REAL_ESTATE_RULES.financing.defaultSellerFinancingPercent
}) {
  
  // Basic income calculations
  const monthlyNOI = noi / 12;
  
  // Amount calculations using percentages
  const downPayment = askingPrice * (downPaymentPercent / 100);
  const dscrLoanAmount = askingPrice * (dscrPercent / 100);
  const sellerFinancingAmount = askingPrice * (sellerFinancingPercent / 100);
  
  // Payment calculations using centralized rules
  const dscrPayment = calculatePMT(
    dscrLoanAmount,
    REAL_ESTATE_RULES.financing.dscrInterestRate,
    REAL_ESTATE_RULES.financing.standardAmortizationYears
  );
  
  const sellerFinancingPayment = calculatePMT(
    sellerFinancingAmount,
    REAL_ESTATE_RULES.financing.sellerFinancingRate,
    REAL_ESTATE_RULES.financing.standardAmortizationYears
  );
  
  // Cash flow calculation
  const monthlyCashFlow = monthlyNOI - (dscrPayment + sellerFinancingPayment);
  const annualCashFlow = monthlyCashFlow * 12;
  
  // Cost calculations using centralized rules
  const { assignmentFeePercent, netToBuyerBasePercent, transactionCostPercent, additionalCostPercent } = REAL_ESTATE_RULES.costs;
  
  const assignmentFee = askingPrice * assignmentFeePercent;
  const transactionCosts = askingPrice * transactionCostPercent;
  const additionalCosts = additionalCostPercent * (askingPrice - dscrLoanAmount);
  const netToBuyer = (askingPrice * netToBuyerBasePercent) - transactionCosts - additionalCosts;
  
  // Return calculations
  const cashInvested = downPayment;
  const cashOnCashReturn = cashInvested > 0 ? annualCashFlow / cashInvested : 0;
  
  return {
    // Income
    noi,
    monthlyNOI,
    monthlyCashFlow,
    annualCashFlow,
    
    // Investments & Loans
    askingPrice,
    downPayment,
    dscrLoanAmount,
    sellerFinancingAmount,
    cashInvested,
    
    // Payments
    dscrPayment,
    sellerFinancingPayment,
    
    // Costs
    assignmentFee,
    transactionCosts,
    additionalCosts,
    netToBuyer,
    
    // Returns
    cashOnCashReturn,
    
    // Percentages used (for reference)
    downPaymentPercent,
    dscrPercent,
    sellerFinancingPercent
  };
}

/**
 * Calculate formatted investment analysis (UI-ready)
 * @param {object} params - Same as calculateInvestmentAnalysis
 * @returns {object} Formatted values ready for UI display
 */
export function calculateFormattedInvestmentAnalysis(params) {
  const analysis = calculateInvestmentAnalysis(params);
  
  return {
    // Formatted for display
    noi: formatCurrency(analysis.noi),
    down: formatCurrency(analysis.downPayment),
    netToBuyer: formatCurrency(analysis.netToBuyer),
    sellerFi: formatCurrency(analysis.sellerFinancingAmount),
    dscr: formatCurrency(analysis.dscrPayment, true),    // true = monthly format
    jvPayment: formatCurrency(analysis.sellerFinancingPayment, true),
    cashFlow: formatCurrency(analysis.monthlyCashFlow, true),
    assignment: formatCurrency(analysis.assignmentFee),
    cocr: formatPercentage(analysis.cashOnCashReturn),
    
    // Raw values for further calculations
    rawCashFlow: analysis.monthlyCashFlow,
    rawPrice: analysis.askingPrice,
    rawNOI: analysis.noi,
    rawCOCR: analysis.cashOnCashReturn
  };
}

/**
 * Calculate price needed to achieve target COCR using centralized rules
 * @param {number} noi - Annual NOI
 * @param {number} targetCOCR - Target cash-on-cash return (as decimal)
 * @param {number} downPaymentPercent - Down payment percentage
 * @param {number} dscrPercent - DSCR loan percentage  
 * @param {number} sellerFinancingPercent - Seller financing percentage
 * @returns {number} Target price to achieve COCR
 */
export function calculatePriceForTargetCOCR(
  noi, 
  targetCOCR, 
  downPaymentPercent = REAL_ESTATE_RULES.financing.defaultDownPaymentPercent,
  dscrPercent = REAL_ESTATE_RULES.financing.defaultDSCRPercent,
  sellerFinancingPercent = REAL_ESTATE_RULES.financing.defaultSellerFinancingPercent
) {
  // Iterative calculation to find target price
  let targetPrice = noi / 0.06; // Start with rough 6% cap rate estimate
  const tolerance = 0.001; // 0.1% tolerance
  const maxIterations = 50;
  let iterations = 0;
  
  while (iterations < maxIterations) {
    const testAnalysis = calculateInvestmentAnalysis({
      askingPrice: targetPrice,
      noi,
      downPaymentPercent,
      dscrPercent,
      sellerFinancingPercent
    });
    
    if (Math.abs(testAnalysis.cashOnCashReturn - targetCOCR) < tolerance) {
      return targetPrice;
    }
    
    // Adjust price based on difference
    const cocrDifference = testAnalysis.cashOnCashReturn - targetCOCR;
    const adjustment = cocrDifference * 0.5; // Damping factor
    
    if (cocrDifference > 0) {
      targetPrice = targetPrice * (1 + Math.abs(adjustment));
    } else {
      targetPrice = targetPrice * (1 - Math.abs(adjustment));
    }
    
    // Sanity bounds
    if (targetPrice < VALIDATION_RULES.price.minimum) targetPrice = VALIDATION_RULES.price.minimum;
    if (targetPrice > noi * 50) targetPrice = noi * 20; // Reasonable cap rate bounds
    
    iterations++;
  }
  
  return targetPrice;
}

/**
 * Calculate price for 15% COCR using centralized rules
 * @param {number} noi - Annual NOI
 * @returns {number} Price needed for 15% COCR
 */
export function calculatePriceFor15PercentCOCR(noi) {
  return calculatePriceForTargetCOCR(noi, REAL_ESTATE_RULES.returns.targetCOCR15Percent);
}

/**
 * Calculate 30% down payment COCR analysis using centralized rules
 * @param {number} askingPrice - Property asking price
 * @param {number} noi - Annual NOI
 * @returns {number} COCR with 30% down payment
 */
export function calculateCOCRWith30PercentDown(askingPrice, noi) {
  const analysis = calculateInvestmentAnalysis({
    askingPrice,
    noi,
    downPaymentPercent: 30
  });
  
  return analysis.cashOnCashReturn;
}

/**
 * Enhanced bedroom extraction with centralized default
 * @param {string|null} text - Text to search (null = use DOM)
 * @returns {number} Number of bedrooms
 */
export function extractBedroomsWithDefault(text = null) {
  const extracted = extractBedrooms(text);
  
  // If standard extraction returns the default 10, use our centralized default
  if (extracted === 10) {
    return REAL_ESTATE_RULES.defaults.bedroomCount;
  }
  
  return extracted;
}

/**
 * Validate property analysis inputs using centralized rules
 * @param {object} params - Parameters to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 */
export function validatePropertyAnalysisInputs({ askingPrice, capRate, noi }) {
  const errors = [];
  
  if (!askingPrice || askingPrice < VALIDATION_RULES.price.minimum || askingPrice > VALIDATION_RULES.price.maximum) {
    errors.push(`Price must be between $${VALIDATION_RULES.price.minimum.toLocaleString()} and $${VALIDATION_RULES.price.maximum.toLocaleString()}`);
  }
  
  if (!capRate || capRate < VALIDATION_RULES.capRate.minimum || capRate > VALIDATION_RULES.capRate.maximum) {
    errors.push(`Cap rate must be between ${VALIDATION_RULES.capRate.minimum * 100}% and ${VALIDATION_RULES.capRate.maximum * 100}%`);
  }
  
  if (noi && noi <= 0) {
    errors.push('NOI must be positive');
  }
  
  return errors;
}