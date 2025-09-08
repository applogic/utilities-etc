const {
  validatePhoneNumber,
  validateEmail,
  validateDate
} = require('../../index');

describe('DOM Utilities - Validation', () => {
  describe('validatePhoneNumber', () => {
    test('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('(555) 123-4567')).toBe(true);
      expect(validatePhoneNumber('555-123-4567')).toBe(true);
      expect(validatePhoneNumber('555.123.4567')).toBe(true);
      expect(validatePhoneNumber('5551234567')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123-456')).toBe(false);
      expect(validatePhoneNumber('not-a-phone')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    test('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('simple@test.org')).toBe(true);
    });

    test('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateDate', () => {
    test('should validate correct dates', () => {
      expect(validateDate('2024-03-15')).toBe(true);
      expect(validateDate('03/15/2024')).toBe(true);
      expect(validateDate('March 15, 2024')).toBe(true);
    });

    test('should reject invalid dates', () => {
      expect(validateDate('invalid-date')).toBe(false);
      expect(validateDate('13/45/2024')).toBe(false);
      expect(validateDate('')).toBe(false);
    });
  });
});
