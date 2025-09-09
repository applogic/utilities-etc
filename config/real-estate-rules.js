// config/real-estate-rules.js in utilities-etc package
/**
 * Centralized Real Estate Business Rules
 * Single source of truth for all applications
 */

export const REAL_ESTATE_RULES = {
  // Financial Structure Rules
  financing: {
    defaultDownPaymentPercent: 60,
    defaultDSCRPercent: 70,
    defaultSellerFinancingPercent: 40,
    dscrInterestRate: 0.075,              // 7.5%
    sellerFinancingRate: 0,               // 0%
    standardAmortizationYears: 30
  },

  // Transaction Cost Rules  
  costs: {
    assignmentFeePercent: 0.05,           // 5%
    netToBuyerBasePercent: 0.10,          // 10%
    transactionCostPercent: 0.0625,       // 6.25%
    additionalCostPercent: 0.03           // 3%
  },

  // Property Type Specific Rules
  propertyIncome: {
    assistedLiving: {
      revenuePerBedroomPerMonth: 1500,    // $1,500/bedroom/month
      monthsPerYear: 12
    },
    shortTermRental: {
      netIncomeAfterExpensesPercent: 0.55, // 55% net after expenses
      fallbackGrossYieldEstimate: 0.10     // 10% if no data available
    },
    multifamily: {
      // Uses direct price × cap rate calculation
    }
  },

  // Return Targets
  returns: {
    targetCOCR15Percent: 0.15,            // 15%
    targetCOCR30Percent: 0.30             // 30%
  },

  // Default Assumptions
  defaults: {
    bedroomCount: 10,
    capRatePercent: 0.05,                 // 5%
    propertyType: 'multifamily'
  }
};

// Validation rules
export const VALIDATION_RULES = {
  price: {
    minimum: 10000,
    maximum: 100000000
  },
  capRate: {
    minimum: 0.001,                        // 0.1%
    maximum: 1                         // 100%
  },
  percentages: {
    minimum: 0,
    maximum: 100
  }
};