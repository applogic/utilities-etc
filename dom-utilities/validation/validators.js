/**
 * Validation utilities for extracted data
 */

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid phone number format
 */
function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Check for valid US phone number lengths
  if (digits.length === 10) {
    return true; // Standard US number
  } else if (digits.length === 11 && digits[0] === '1') {
    return true; // US number with country code
  }
  
  return false;
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date string
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
function validateDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

module.exports = {
  validatePhoneNumber,
  validateEmail,
  validateDate
};
