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
  
  // Check for tel: links first (only in browser environment)
  if (typeof document !== 'undefined') {
    const telLinks = document.querySelectorAll('a[href^="tel:"]');
    if (telLinks.length > 0) {
      const telHref = telLinks[0].getAttribute("href");
      const phoneFromTel = telHref.replace("tel:", "").replace(/\D/g, "");
      if (phoneFromTel.length >= 10) {
        return phoneFromTel;
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
  
  // Bedroom patterns
  const bedroomPatterns = [
    /(\d+)\s*bed(?:room)?s?\b/i,
    /beds?\s*:?\s*(\d+)/i,
    /(\d+)\s*br\b/i
  ];
  
  for (const pattern of bedroomPatterns) {
    const match = searchText.match(pattern);
    if (match) {
      const bedrooms = parseInt(match[1]);
      // Sanity check - reasonable range for multifamily
      if (bedrooms > 0 && bedrooms <= 100) {
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
  const pricePatterns = [
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,  // $1,000,000.00
    /\$\s*(\d+(?:\.\d+)?)\s*([KMB])/gi,        // $1.5M, $500K, $2B
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/gi  // 1,000,000 dollars
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

module.exports = {
  extractPhoneNumber,
  extractBedrooms,
  extractEmail,
  extractPrice
};
