const {
  calculateAppreciation,
  calculateCapRate,
  calculateCashFlow,
  calculateCashFlowYield,
  calculateCOCR,
  calculateCOCR15,
  calculateCOCR30,
  calculateCOCRScenario,
  calculateNetToBuyer,
  calculatePMT
} = require('../../index');

describe('Real Estate Calculations', () => {
  describe('Cash Flow Calculations', () => {
    test('calculateCapRate should work correctly', () => {
      const result = calculateCapRate(60000, 1000000);
      expect(result).toBe(0.06); // 6% cap rate
    });

    test('calculateCashFlow should work correctly', () => {
      const monthlyNOI = 5000;
      const loanAmount = 700000;
      const result = calculateCashFlow(monthlyNOI, loanAmount, 0.075, 30);
      expect(result).toBeFinanciallyReasonable();
    });

    test('calculateCashFlowYield should work correctly', () => {
      const result = calculateCashFlowYield(12000, 1000000);
      expect(result).toBe(0.012); // 1.2% yield
    });
  });

  describe('COCR Calculations', () => {
    test('calculateCOCR should work correctly', () => {
      const result = calculateCOCR(15000, 200000);
      expect(result).toBe(0.075); // 7.5% COCR
    });

    test('calculateCOCR15 should work correctly', () => {
      const result = calculateCOCR15(1000000, 60000, 0.075, 30);
      expect(result).toBeFinanciallyReasonable();
      expect(result).toBeGreaterThan(-0.1); // Should be reasonable
    });

    test('calculateCOCR30 should work correctly', () => {
      const result = calculateCOCR30(1000000, 60000, 0.075, 30);
      const cocr15 = calculateCOCR15(1000000, 60000, 0.075, 30);
      expect(result).toBeFinanciallyReasonable();
      expect(result).toBeGreaterThan(cocr15); // 30% down should have higher COCR
    });

    test('calculateCOCRScenario should work with custom parameters', () => {
      const result = calculateCOCRScenario(1000000, 60000, 0.25, 0.08, 25);
      expect(result).toBeFinanciallyReasonable();
    });
  });

  describe('Cost Calculations', () => {
    test('calculateNetToBuyer should return proper breakdown', () => {
      const result = calculateNetToBuyer(1000000, 0.25);
      
      expect(result).toHaveProperty('downPayment', 250000);
      expect(result).toHaveProperty('netToBuyer');
      expect(result).toHaveProperty('breakdown');
      expect(result.netToBuyer).toBeGreaterThan(250000); // Should include costs
      
      // Verify breakdown structure
      expect(result.breakdown).toHaveProperty('Down Payment');
      expect(result.breakdown).toHaveProperty('Seller Commission');
      expect(result.breakdown).toHaveProperty('Closing Costs');
    });

    test('calculateNetToBuyer should handle custom constants', () => {
      const constants = {
        sellerAgentCommission: 0.03,
        closing: 0.015,
        bridge: 0.04
      };
      
      const result = calculateNetToBuyer(1000000, 0.25, constants);
      expect(result.sellerCommission).toBe(30000); // 3% of 1M
      expect(result.closingCosts).toBe(15000); // 1.5% of 1M
    });
  });

  describe('Appreciation Calculations', () => {
    test('calculateAppreciation should work correctly', () => {
      const result = calculateAppreciation(1000000, 0.03, 5, 100000, 50000);
      
      expect(result).toHaveProperty('futureValue');
      expect(result).toHaveProperty('cashOutAfterRefi');
      expect(result.futureValue).toBeGreaterThan(1000000);
      expect(result.totalOwing).toBe(150000);
    });

    test('calculateAppreciation should handle zero balances', () => {
      const result = calculateAppreciation(1000000, 0.03, 5);
      expect(result.totalOwing).toBe(0);
      expect(result.cashOutAfterRefi).toBeGreaterThan(0);
    });
  });

  describe('DSCR Payment Helper', () => {
    test('should calculate DSCR payment correctly', () => {
      // Helper function referenced in tests
      const calculateDSCRPayment = (askingPrice) => {
        const dscrLoanAmount = askingPrice * 0.70;
        return calculatePMT(dscrLoanAmount, 0.075, 30);
      };

      const result = calculateDSCRPayment(1000000);
      expect(result).toBeWithinRange(4800, 4900); // ~$4,890/month for $700k loan
    });
  });
});
