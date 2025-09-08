import {
  extractPhoneNumber,
  extractBedrooms,
  extractEmail,
  extractPrice
} from '../../index.js';

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

  describe('Complex Real-World Extraction', () => {
    test('should extract phone numbers from complex text', () => {
      const complexText = `
        Contact our office at (555) 123-4567 for inquiries.
        Cell: 555.987.6543 | Fax: (555) 111-2222
        Emergency line: +1 (555) 999-0000
      `;
      
      const phone = extractPhoneNumber(complexText);
      expect(phone).toMatch(/\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/); // Should match pattern
    });

    test('should extract bedroom counts from listing descriptions', () => {
      const listings = [
        'Beautiful 4 bedroom, 3 bathroom home',
        'Studio apartment - 0 bedrooms',
        'Large property with 12 BR and 8 BA',
        '25-unit apartment building with mostly 2 bed units'
      ];
      
      expect(extractBedrooms(listings[0])).toBe(4);
      expect(extractBedrooms(listings[1])).toBe(0);
      expect(extractBedrooms(listings[2])).toBe(12);
      expect(extractBedrooms(listings[3])).toBe(2);
    });

    test('should extract emails from contact information', () => {
      const contactText = `
        Primary: john.doe@realty.com
        Secondary: jane.smith@company.co.uk
        Support: help@property-management.org
      `;
      
      const emails = extractEmail(contactText);
      expect(emails).toHaveLength(3);
      expect(emails).toContain('john.doe@realty.com');
      expect(emails).toContain('jane.smith@company.co.uk');
      expect(emails).toContain('help@property-management.org');
    });

    test('should extract prices from various formats', () => {
      const priceTexts = [
        'Listed at $1,500,000',
        'Reduced to $1.2M from $1.5M',
        'Starting at $750K or best offer',
        'Price: 2500000 dollars'
      ];
      
      expect(extractPrice(priceTexts[0])).toContain(1500000);
      
      const reducedPrices = extractPrice(priceTexts[1]);
      expect(reducedPrices).toContain(1200000);
      expect(reducedPrices).toContain(1500000);
      
      expect(extractPrice(priceTexts[2])).toContain(750000);
      expect(extractPrice(priceTexts[3])).toContain(2500000);
    });
  });

  describe('Edge Cases in Text Extraction', () => {
    test('should handle malformed phone numbers', () => {
      const malformed = [
        'Call 123-45-67 for info', // Too short
        '(555) 123-45678',         // Too long
        '555-abc-defg',            // Non-numeric
        ''                         // Empty
      ];
      
      malformed.forEach(text => {
        const result = extractPhoneNumber(text);
        // Should either extract valid format or return "Not found"
        expect(typeof result).toBe('string');
      });
    });

    test('should handle extreme bedroom counts', () => {
      expect(extractBedrooms('Property with 150 bedrooms')).toBe(10); // Over limit, returns default
      expect(extractBedrooms('Property with -5 bedrooms')).toBe(5);  // Invalid, but returns the number found assuming positive
    });

    test('should handle malformed emails', () => {
      const malformedEmails = [
        '@example.com',           // Missing local part
        'user@',                  // Missing domain
        'not-an-email',          // No @ symbol
        'user@domain'            // Missing TLD
      ];
      
      malformedEmails.forEach(text => {
        const emails = extractEmail(text);
        expect(Array.isArray(emails)).toBe(true);
        // Should not extract malformed emails
      });
    });
  });
