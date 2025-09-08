import {
  calculatePMT,
  calculateRemainingBalance,
  calculateInterestOverTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPriceValue
} from '../../index.js';

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

  describe('Edge Cases and Precision Testing', () => {
    test('calculatePMT should handle extreme scenarios', () => {
      // Very high interest rate
      const highRate = calculatePMT(100000, 0.25, 5);
      expect(highRate).toBeGreaterThan(2000);
      expect(highRate).toBeFinanciallyReasonable();
      
      // Very long term
      const longTerm = calculatePMT(100000, 0.04, 50);
      expect(longTerm).toBeLessThan(500);
      
      // Very short term
      const shortTerm = calculatePMT(100000, 0.06, 1);
      expect(shortTerm).toBeCloseTo(8606.64, 2); // Correct PMT calculation
    });

    test('calculateRemainingBalance should handle full payoff scenarios', () => {
      // Pay off entire loan
      const fullyPaid = calculateRemainingBalance(100000, 0.06, 10, 10);
      expect(fullyPaid).toBeCloseTo(0, 2);
      
      // Pay more than loan term
      const overpaid = calculateRemainingBalance(100000, 0.06, 10, 15);
      expect(overpaid).toBe(0);
    });

    test('formatting should handle precision edge cases', () => {
      // Very precise decimals
      expect(formatCurrency(1234567.891)).toBe('$1.235M');
      expect(formatPercentage(0.123456789, 4)).toBe('12.3457%');
      
      // Large numbers
      expect(formatCurrency(999999999)).toBe('$1000M');
      expect(formatNumber(1234567890.123, 2)).toBe('1,234,567,890.12');
      
      // Very small numbers
      expect(formatCurrency(0.01)).toBe('$0');
      expect(formatPercentage(0.0001, 3)).toBe('0.010%');
    });

    test('should handle floating point precision in financial calculations', () => {
      // Test precision with realistic payment calculation
      const payment = calculatePMT(299999.99, 0.0675, 30);
      expect(payment).toBeCloseTo(1945.79, 2); // Correct PMT calculation
      
      // Test precision with interest calculation
      const interest = calculateInterestOverTime(100000, 0.0625, 30);
      expect(interest).toBeCloseTo(121658.19, 2); ;
    });
  });

  describe('Real-World Financial Scenarios', () => {
    test('should calculate realistic mortgage scenarios', () => {
      // Conventional 30-year fixed
      const conventional = calculatePMT(400000, 0.0675, 30);
      expect(conventional).toBeWithinRange(2500, 2700);
      
      // 15-year mortgage (higher payment, lower total interest)
      const fifteenYear = calculatePMT(400000, 0.0625, 15);
      const thirtyYear = calculatePMT(400000, 0.0625, 30);
      expect(fifteenYear).toBeGreaterThan(thirtyYear);
      
      const interest15 = calculateInterestOverTime(400000, 0.0625, 15);
      const interest30 = calculateInterestOverTime(400000, 0.0625, 30);
      expect(interest15).toBeLessThan(interest30);
    });

    test('should format various financial scenarios correctly', () => {
      // Typical property prices
      expect(formatCurrency(750000)).toBe('$750K');
      expect(formatCurrency(1200000)).toBe('$1.2M');
      expect(formatCurrency(2500000)).toBe('$2.5M');
      
      // Monthly payments
      expect(formatCurrency(2847.56, true)).toBe('$2,848');
      expect(formatCurrency(1234.78, true)).toBe('$1,235');
    });
  });
