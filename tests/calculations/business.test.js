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
