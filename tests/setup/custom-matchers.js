// Additional custom matchers for financial calculations

expect.extend({
  toBeValidCurrency(received) {
    const currencyPatterns = [
      /^-?\$[\d,]+$/, // $1,234
      /^-?\$[\d,]+\.\d{2}$/, // $1,234.56  
      /^-?\$\d+(\.\d+)?[KM]$/ // $1.5M, $500K, $2M
    ];
    
    const pass = typeof received === 'string' && 
                currencyPatterns.some(pattern => pattern.test(received));
    
    return {
      message: () => `expected ${received} to be a valid currency format`,
      pass
    };
  },
  
  toBeValidPercentage(received) {
    const percentageRegex = /^\d+(\.\d+)?%$/;
    const pass = typeof received === 'string' && percentageRegex.test(received);
    
    return {
      message: () => `expected ${received} to be a valid percentage format`,
      pass
    };
  },
  
  toBeFinanciallyReasonable(received, context = "") {
    // Basic sanity checks for financial values
    const pass = typeof received === 'number' && 
                  isFinite(received) && 
                  !isNaN(received) &&
                  received > -1000000 && // Not unreasonably negative
                  received < 100000000;  // Not unreasonably large
    
    return {
      message: () => `expected ${received} to be a financially reasonable number ${context}`,
      pass
    };
  }
});
