/**
 * Text and DOM extraction utilities
 */

/**
 * Extract phone number from DOM or text
 * @param {string} text - Optional text to search, uses document if not provided
 * @returns {string} Phone number or "Not found"
 */
function extractPhoneNumber(text = null) {
  const searchText = text || (typeof document !== 'undefined' ? document.body.innerText : '');

  if (!searchText || typeof searchText !== 'string') {
    return "Not found";
  }
  
  // Check for tel: links first (only in browser environment)
  // Check for formatted phone numbers in DOM elements first (only in browser environment)
  if (typeof document !== 'undefined') {
    // Try specific selectors for phone numbers in order of preference
    const phoneSelectors = [
      'span.phone-number',           // <span class="phone-number">(510) 680-2437</span>
      'a.number[href^="tel:"]',      // <a class="number" href="tel:...">(510) 680-2437</a>
      '#broker-phone-number',        // ID-based selector
      '.broker-phone .number',       // Class-based selector in broker section
      'a[href^="tel:"]'             // Any tel link
    ];
    
    for (const selector of phoneSelectors) {
      const phoneElement = document.querySelector(selector);
      if (phoneElement) {
        const phoneText = phoneElement.textContent?.trim();
        // Skip button text and empty strings
        if (phoneText && phoneText !== 'Call' && phoneText.length > 5) {
          // Verify it looks like a phone number before returning
          if (/\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/.test(phoneText) || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(phoneText)) {
            return phoneText;
          }
        }
      }
    }
  }
  
  // Phone number patterns - most specific first
  const phonePatterns = [
    /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,  // (555) 123-4567
    /\+?1?\s*\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,  // +1 (555) 123-4567
    /\+?1?\s*\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,  // +1 555-123-4567 or 555.123.4567
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g   // 555-123-4567
  ];
  
  for (const pattern of phonePatterns) {
    const matches = searchText.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0].trim();
    }
  }
  
  return "Not found";
}

/**
 * Extract bedroom count from DOM text
 * @param {string} text - Optional text to search, uses document if not provided  
 * @returns {number} Number of bedrooms or default value
 */
function extractBedrooms(text = null) {
  const searchText = text || (typeof document !== 'undefined' ? document.body.innerText : '');
  const defaultBedrooms = 10;
  
  // Bedroom patterns - updated to handle 0 and negative validation
  const bedroomPatterns = [
    /(\d+)\s*bed(?:room)?s?\b/i,
    /beds?\s*:?\s*(\d+)/i,
    /(\d+)\s*br\b/i
  ];
  
  for (const pattern of bedroomPatterns) {
    const match = searchText.match(pattern);
    if (match) {
      const bedrooms = parseInt(match[1]);
      // Accept 0 bedrooms as valid, reject negative, reasonable range check
      if (bedrooms >= 0 && bedrooms <= 100) {
        return bedrooms;
      }
    }
  }
  
  return defaultBedrooms;
}

/**
 * Extract email addresses from text
 * @param {string} text - Optional text to search, uses document if not provided
 * @returns {string[]} Array of email addresses found
 */
function extractEmail(text = null) {
  const searchText = text || (typeof document !== 'undefined' ? document.body.innerText : '');
  
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = searchText.match(emailPattern);
  
  return matches || [];
}

/**
 * Extract price values from text
 * @param {string} text - Optional text to search, uses document if not provided
 * @returns {number[]} Array of price values found
 */
function extractPrice(text = null) {
  const searchText = text || (typeof document !== 'undefined' ? document.body.innerText : '');
  
  // Price patterns - looking for currency symbols followed by numbers
  // Price patterns - add pattern for "dollars" format
  const pricePatterns = [
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,  // $1,000,000.00
    /\$\s*(\d+(?:\.\d+)?)\s*([KMB])/gi,        // $1.5M, $500K, $2B
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/gi,  // 1,000,000 dollars
    /(\d{7,})\s*(?:dollars?|usd)/gi            // 2500000 dollars (no commas)
  ];
  
  const prices = [];
  
  for (const pattern of pricePatterns) {
    let match;
    while ((match = pattern.exec(searchText)) !== null) {
      let value = parseFloat(match[1].replace(/,/g, ''));
      
      // Handle K, M, B multipliers
      if (match[2]) {
        const multiplier = match[2].toUpperCase();
        if (multiplier === 'K') value *= 1000;
        else if (multiplier === 'M') value *= 1000000;
        else if (multiplier === 'B') value *= 1000000000;
      }
      
      if (!isNaN(value)) {
        prices.push(value);
      }
    }
  }
  
  return prices;
}

export {
  extractPhoneNumber,
  extractBedrooms,
  extractEmail,
  extractPrice
};
