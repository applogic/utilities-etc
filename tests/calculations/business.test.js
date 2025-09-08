const {
  calculateCompoundGrowth,
  calculateNPV,
  calculatePresentValue,
  calculateCurrentRatio,
  calculateROE,
  calculateROI
} = require('../../index');

describe('Business Calculations', () => {
  describe('Projections', () => {
    test('calculateCompoundGrowth should work correctly', () => {
      const result = calculateCompoundGrowth(100000, 0.05, 10);
      expect(result).toBeCloseTo(162889.46, 2);
    });

    test('calculatePresentValue should work correctly', () => {
      const result = calculatePresentValue(162889.46, 0.05, 10);
      expect(result).toBeCloseTo(100000, 2);
    });

    test('calculateNPV should work correctly', () => {
      const cashFlows = [10000, 15000, 20000, 25000, 30000];
      const result = calculateNPV(cashFlows, 0.10, 50000);
      expect(result).toBeFinanciallyReasonable();
      expect(result).toBeGreaterThan(0); // Should be positive NPV
    });
  });

  describe('Ratios', () => {
    test('calculateROI should work correctly', () => {
      const result = calculateROI(150000, 100000);
      expect(result).toBe(0.5); // 50% ROI
    });

    test('calculateROE should work correctly', () => {
      const result = calculateROE(50000, 500000);
      expect(result).toBe(0.1); // 10% ROE
    });

    test('calculateCurrentRatio should work correctly', () => {
      const result = calculateCurrentRatio(200000, 100000);
      expect(result).toBe(2.0); // 2:1 ratio
    });

    test('should handle zero values gracefully', () => {
      expect(calculateROI(100000, 0)).toBe(0);
      expect(calculateROE(50000, 0)).toBe(0);
      expect(calculateCurrentRatio(100000, 0)).toBe(0);
    });
  });
});

  describe('Edge Cases and Error Handling', () => {
    test('calculateCompoundGrowth should handle extreme values', () => {
      // Zero growth
      expect(calculateCompoundGrowth(100000, 0, 10)).toBe(100000);
      
      // Negative growth (depreciation)
      const result = calculateCompoundGrowth(100000, -0.05, 5);
      expect(result).toBeLessThan(100000);
      expect(result).toBeFinanciallyReasonable();
      
      // Very high growth
      const highGrowth = calculateCompoundGrowth(1000, 0.50, 3);
      expect(highGrowth).toBeCloseTo(3375, 2);
    });

    test('calculateNPV should handle edge cases', () => {
      // All negative cash flows
      const negativeFlows = [-1000, -2000, -3000];
      const result = calculateNPV(negativeFlows, 0.10, 0);
      expect(result).toBeLessThan(0);
      
      // Zero discount rate
      const zeroRate = calculateNPV([1000, 2000, 3000], 0, 0);
      expect(zeroRate).toBe(6000);
      
      // Empty cash flows
      expect(calculateNPV([], 0.10, 1000)).toBe(-1000);
    });

    test('ratio calculations should handle zero denominators gracefully', () => {
      expect(calculateCurrentRatio(100000, 0)).toBe(0);
      expect(calculateROE(50000, 0)).toBe(0);
      expect(calculateROI(50000, 0)).toBe(0);
    });
  });

  describe('Real-World Business Scenarios', () => {
    test('should calculate realistic startup investment analysis', () => {
      const initialInvestment = 500000;
      const projectedCashFlows = [50000, 75000, 100000, 125000, 150000];
      const discountRate = 0.12; // Higher risk rate
      
      const npv = calculateNPV(projectedCashFlows, discountRate, initialInvestment);
      const roi = calculateROI(projectedCashFlows.reduce((sum, cf) => sum + cf, 0), initialInvestment);
      
      expect(npv).toBeFinanciallyReasonable();
      expect(roi).toBeGreaterThan(-1); // At least not total loss
    });

    test('should analyze corporate financial health', () => {
      // Strong company ratios
      const currentRatio = calculateCurrentRatio(2000000, 800000);
      const roe = calculateROE(300000, 2500000);
      
      expect(currentRatio).toBeGreaterThan(2); // Good liquidity
      expect(roe).toBeWithinRange(0.10, 0.15); // Healthy 10-15% ROE
    });
  });
