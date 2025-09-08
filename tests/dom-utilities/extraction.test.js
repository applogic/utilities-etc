const {
  extractPhoneNumber,
  extractBedrooms,
  extractEmail,
  extractPrice
} = require('../../index');

describe('DOM Utilities - Text Extraction', () => {
  describe('extractPhoneNumber', () => {
    test('should extract phone number from text', () => {
      const text = 'Call us at (555) 123-4567 for more info';
      expect(extractPhoneNumber(text)).toBe('(555) 123-4567');
    });

    test('should extract different phone formats', () => {
      expect(extractPhoneNumber('555-123-4567')).toBe('555-123-4567');
      expect(extractPhoneNumber('555.123.4567')).toBe('555.123.4567');
      expect(extractPhoneNumber('555 123 4567')).toBe('555 123 4567');
    });

    test('should return "Not found" when no phone number present', () => {
      expect(extractPhoneNumber('No phone here')).toBe('Not found');
    });
  });

  describe('extractBedrooms', () => {
    test('should extract bedroom count from text', () => {
      const text = 'This property has 15 bedrooms and is great';
      expect(extractBedrooms(text)).toBe(15);
    });

    test('should handle various bedroom formats', () => {
      expect(extractBedrooms('4 bed property')).toBe(4);
      expect(extractBedrooms('3BR/2BA')).toBe(3);
      expect(extractBedrooms('2 bedroom apartment')).toBe(2);
    });

    test('should return default value when no bedroom info found', () => {
      expect(extractBedrooms('Nice property')).toBe(10);
    });
  });

  describe('extractEmail', () => {
    test('should extract email from text', () => {
      const text = 'Contact john@example.com for details';
      const emails = extractEmail(text);
      expect(emails).toContain('john@example.com');
    });

    test('should extract multiple emails', () => {
      const text = 'Contact john@example.com or mary@test.org';
      const emails = extractEmail(text);
      expect(emails).toHaveLength(2);
      expect(emails).toContain('john@example.com');
      expect(emails).toContain('mary@test.org');
    });

    test('should return empty array for no emails', () => {
      expect(extractEmail('No emails here')).toEqual([]);
    });
  });

  describe('extractPrice', () => {
    test('should extract price from text', () => {
      const text = 'Listed at $1,500,000 or best offer';
      const prices = extractPrice(text);
      expect(prices).toContain(1500000);
    });

    test('should extract multiple prices', () => {
      const text = 'Was $2,000,000 now $1,750,000';
      const prices = extractPrice(text);
      expect(prices).toHaveLength(2);
      expect(prices).toContain(2000000);
      expect(prices).toContain(1750000);
    });

    test('should return empty array for no prices', () => {
      expect(extractPrice('No prices mentioned')).toEqual([]);
    });
  });
});
