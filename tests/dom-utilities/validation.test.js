import {
  validatePhoneNumber,
  validateEmail,
  validateDate
} from '../../index.js';

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

  describe('Comprehensive Validation Edge Cases', () => {
    test('validatePhoneNumber should handle international formats', () => {
      // US formats
      expect(validatePhoneNumber('(555) 123-4567')).toBe(true);
      expect(validatePhoneNumber('555-123-4567')).toBe(true);
      expect(validatePhoneNumber('555.123.4567')).toBe(true);
      expect(validatePhoneNumber('5551234567')).toBe(true);
      expect(validatePhoneNumber('+1 555 123 4567')).toBe(true);
      
      // Invalid formats
      expect(validatePhoneNumber('123-456')).toBe(false);        // Too short
      expect(validatePhoneNumber('123-456-789012')).toBe(false); // Too long
      expect(validatePhoneNumber('abc-def-ghij')).toBe(false);   // Non-numeric
    });

    test('validateEmail should handle complex valid emails', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example.co.uk',
        'firstname.lastname@company.org',
        'a@b.co'  // Minimal valid email
      ];
      
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    test('validateEmail should reject invalid formats', () => {
      const invalidEmails = [
        'plainaddress',           // No @
        '@missingdomain.com',    // Missing local part
        'missing@domain',        // Missing TLD
        'spaces @example.com',   // Spaces not allowed
        'user@@example.com',     // Double @
        'user@',                 // Missing domain
        '',                      // Empty string
        null,                    // Null
        undefined               // Undefined
      ];
      
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    test('validateDate should handle various date formats', () => {
      const validDates = [
        '2024-03-15',           // ISO format
        'March 15, 2024',       // Long format
        '03/15/2024',          // US format
        // Remove problematic ones for now:
        // '15/03/2024',          // EU format (ambiguous)
        '2024/03/15',          // Alternative ISO
        'Mar 15, 2024'         // Short month
      ];
      
      validDates.forEach(date => {
        expect(validateDate(date)).toBe(true);
      });
    });


    test('validateDate should reject invalid dates', () => {
      const invalidDates = [
        'not-a-date',          // Random string
        '13/45/2024',          // Invalid month/day
        '2024-02-30',          // Invalid date (Feb 30)
        '2024-13-01',          // Invalid month
        '',                    // Empty string
        '2024/15/45'          // Invalid day/month
      ];
      
      invalidDates.forEach(date => {
        const result = validateDate(date);
        if (result !== false) {
          console.error(`Expected ${date} to be invalid but got: ${result}`);
        }
        expect(result).toBe(false);
      });
    });


    test('should handle type safety for all validators', () => {
      const nonStringInputs = [123, true, {}, [], null, undefined];
      
      nonStringInputs.forEach(input => {
        expect(validatePhoneNumber(input)).toBe(false);
        expect(validateEmail(input)).toBe(false);
        expect(validateDate(input)).toBe(false);
      });
    });
  });
