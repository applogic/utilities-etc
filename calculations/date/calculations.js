/**
 * Date calculation utilities
 */

/**
 * Calculate Days on Market from listing date
 * @param {string} dateString - Date string in various formats
 * @returns {string} Formatted DOM string or error message
 */
function calculateDOM(dateString) {
  if (!dateString || dateString === "Not found" || dateString === "") {
    return "Not found";
  }
  
  try {
    // Handle various date formats
    let listingDate;
    
    // Try MM/DD/YYYY format first
    if (dateString.includes("/")) {
      const parts = dateString.split("/");
      if (parts.length === 3) {
        // Ensure MM/DD/YYYY format
        const month = parts[0].padStart(2, "0");
        const day = parts[1].padStart(2, "0");
        const year = parts[2];
        listingDate = new Date(`${month}/${day}/${year}`);
      }
    } else {
      listingDate = new Date(dateString);
    }
    
    if (isNaN(listingDate.getTime())) {
      return "Invalid date";
    }
    
    const today = new Date();
    const timeDiff = today.getTime() - listingDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return "Calculation error";
    }
    
    // Format the original date consistently
    const formattedDate = listingDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit", 
      year: "numeric"
    });
    
    return `${daysDiff} (${formattedDate})`;
    
  } catch (error) {
    console.error("Error calculating DOM:", error);
    return "Calculation error";
  }
}

/**
 * Calculate time difference between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date (defaults to now)
 * @returns {Object} Time difference object with days, hours, minutes
 */
function calculateTimeDifference(startDate, endDate = new Date()) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }
    
    const diffMs = Math.abs(end.getTime() - start.getTime());
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      totalMs: diffMs,
      days,
      hours,
      minutes,
      formatted: `${days}d ${hours}h ${minutes}m`
    };
    
  } catch (error) {
    return {
      error: error.message,
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      formatted: "Invalid"
    };
  }
}

export {
  calculateDOM,
  calculateTimeDifference
};
