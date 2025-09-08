const {
  calculateDOM,
  calculateTimeDifference
} = require('../../index');

describe('Date Calculations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('calculateDOM', () => {
    test('should calculate days on market correctly', () => {
      const result = calculateDOM('01/15/2024');
      expect(result).toBe('59 (01/15/2024)');
    });

    test('should handle various date formats', () => {
      expect(calculateDOM('2024-01-15')).toContain('60'); // ISO date may have timezone offset
      expect(calculateDOM('1/15/2024')).toBe('59 (01/15/2024)'); // MM/DD/YYYY is parsed correctly
    });

    test('should handle invalid dates', () => {
      expect(calculateDOM('invalid-date')).toBe('Invalid date');
      expect(calculateDOM('Not found')).toBe('Not found');
      expect(calculateDOM('')).toBe('Not found');
    });

    test('should handle future dates', () => {
      const result = calculateDOM('12/31/2024');
      expect(result).toBe('Calculation error');
    });
  });

  describe('calculateTimeDifference', () => {
    test('should calculate time difference correctly', () => {
      const result = calculateTimeDifference('2024-03-01');
      expect(result.days).toBe(14);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.formatted).toBe('14d 0h 0m');
    });

    test('should handle invalid dates', () => {
      const result = calculateTimeDifference('invalid-date');
      expect(result.error).toBeDefined();
      expect(result.days).toBe(0);
    });

    test('should handle custom end dates', () => {
      const result = calculateTimeDifference('2024-03-01', '2024-03-10');
      expect(result.days).toBe(9);
    });
  });
});
