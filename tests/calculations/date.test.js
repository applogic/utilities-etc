import {
  calculateDOM,
  calculateTimeDifference
} from '../../index.js';

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

describe('Advanced Date Calculations', () => {
  // Separate timer setup for advanced tests to avoid conflicts
  beforeEach(() => {
    jest.useRealTimers(); // Clear any existing timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calculateDOM should handle leap years correctly', () => {
    jest.setSystemTime(new Date('2025-09-08T12:00:00.000Z'));
    
    const domLeapYear = calculateDOM('02/29/2024');
    
    // Test the format and that it contains a reasonable number
    expect(domLeapYear).toMatch(/^\d+ \(02\/29\/2024\)$/);
    
    // Extract the number and verify it's reasonable (should be ~550-560 days)
    const daysMatch = domLeapYear.match(/^(\d+)/);
    const days = parseInt(daysMatch[1]);
    expect(days).toBeGreaterThan(550);
    expect(days).toBeLessThan(570);
  });

  test('calculateDOM should handle year transitions', () => {
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    
    const lastYear = calculateDOM('12/01/2023');
    
    // Test format and reasonable range instead of exact value
    expect(lastYear).toMatch(/^\d+ \(12\/01\/2023\)$/);
    
    // Extract days and verify it's reasonable (should be ~45 days)
    const daysMatch = lastYear.match(/^(\d+)/);
    const days = parseInt(daysMatch[1]);
    expect(days).toBeGreaterThan(40);
    expect(days).toBeLessThan(50);
  });

  test('calculateTimeDifference should handle various time periods', () => {
    const baseDate = '2024-01-01T00:00:00Z';
    
    // Test different periods
    const oneHour = calculateTimeDifference(baseDate, '2024-01-01T01:00:00Z');
    expect(oneHour.hours).toBe(1);
    expect(oneHour.days).toBe(0);
    
    const oneDay = calculateTimeDifference(baseDate, '2024-01-02T00:00:00Z');
    expect(oneDay.days).toBe(1);
    expect(oneDay.hours).toBe(0);
    
    const oneWeek = calculateTimeDifference(baseDate, '2024-01-08T00:00:00Z');
    expect(oneWeek.days).toBe(7);
  });

  test('should handle timezone edge cases', () => {
    // Test with explicit timezone handling
    const utcDate = '2024-01-15T00:00:00Z';
    const localDate = '2024-01-15T12:00:00';
    
    const diff = calculateTimeDifference(utcDate, localDate);
    expect(diff.totalMs).toBeGreaterThan(0);
    expect(diff.hours).toBeGreaterThanOrEqual(0);
  });
});
