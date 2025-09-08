const {
  calculatePMT,
  calculateRemainingBalance,
  calculateInterestOverTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPriceValue
} = require('../../index');

describe('Core Calculations', () => {
  describe('Loan Calculations', () => {
    test('calculatePMT should work correctly', () => {
      const result = calculatePMT(300000, 0.06, 30);
      expect(result).toBeCloseTo(1798.65, 2);
    });

    test('calculatePMT should handle zero interest', () => {
      const result = calculatePMT(360000, 0, 30);
      expect(result).toBe(1000); // 360k / (30*12) = 1000
    });

    test('calculateRemainingBalance should work correctly', () => {
      const result = calculateRemainingBalance(300000, 0.06, 30, 5);
      expect(result).toBeGreaterThan(250000);
      expect(result).toBeLessThan(300000);
    });

    test('calculateInterestOverTime should work correctly', () => {
      const result = calculateInterestOverTime(300000, 0.06, 30);
      expect(result).toBeGreaterThan(300000); // Interest should be substantial
      expect(result).toBeFinanciallyReasonable();
    });
  });

  describe('Formatting', () => {
    test('formatCurrency should format correctly', () => {
      expect(formatCurrency(1500000)).toBe('$1.5M');
      expect(formatCurrency(75000)).toBe('$75K');
      expect(formatCurrency(999)).toBe('$999');
      expect(formatCurrency(2500, true)).toBe('$2,500');
      expect(formatCurrency(-50000)).toBe('-$50K');
    });

    test('formatCurrency should handle invalid inputs', () => {
      expect(formatCurrency(NaN)).toBe('N/A');
      expect(formatCurrency(Infinity)).toBe('N/A');
    });

    test('formatPercentage should work correctly', () => {
      expect(formatPercentage(0.065)).toBe('6.5%');
      expect(formatPercentage(0.15, 0)).toBe('15%');
      expect(formatPercentage(0.0675, 2)).toBe('6.75%');
    });

    test('formatNumber should work correctly', () => {
      expect(formatNumber(1234.567)).toBe('1,234.57');
      expect(formatNumber(1234.567, 1)).toBe('1,234.6');
    });

    test('formatPriceValue should work correctly', () => {
      expect(formatPriceValue(1500000)).toBe('$2M');
      expect(formatPriceValue(750000)).toBe('$750K');
      expect(formatPriceValue(999)).toBe('$999');
    });
  });
});
