#!/bin/bash

# Setup script for @archerjessop/utilities-etc test suite
# Creates all necessary directories and test files

echo "🚀 Setting up test suite for @archerjessop/utilities-etc..."

# Create test directory structure
echo "📁 Creating directory structure..."
mkdir -p tests/{setup,calculations,dom-utilities,integration}

# Create setup files
echo "⚙️  Creating setup files..."

# Main Jest configuration
cat > tests/setup/jest.config.js << 'EOF'
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/test-helpers.js"],
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
    "!jest.config.js",
    "!eslint.config.js"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: [
    "**/tests/**/*.test.js"
  ],
  verbose: true
};
EOF

# Test helpers and custom matchers
cat > tests/setup/test-helpers.js << 'EOF'
// Custom Jest matchers and test utilities

expect.extend({
  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${min} - ${max}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${min} - ${max}`,
        pass: false,
      };
    }
  },
  
  toBeCloseToPercentage(received, expected, tolerance = 0.001) {
    const pass = Math.abs(received - expected) <= tolerance;
    if (pass) {
      return {
        message: () => `expected ${received} not to be close to ${expected}% (tolerance: ${tolerance})`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be close to ${expected}% (tolerance: ${tolerance})`,
        pass: false,
      };
    }
  }
});

// Mock Chrome browser APIs for DOM utilities tests
Object.defineProperty(window, 'chrome', {
  value: {
    runtime: {
      sendMessage: jest.fn(),
      onMessage: {
        addListener: jest.fn()
      }
    }
  },
  writable: true
});

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Set up fake timers for date-dependent tests
beforeEach(() => {
  jest.clearAllMocks();
});
EOF

# Custom matchers file
cat > tests/setup/custom-matchers.js << 'EOF'
// Additional custom matchers for financial calculations

expect.extend({
  toBeValidCurrency(received) {
    const currencyRegex = /^-?\$[\d,]+(\.\d{2})?[KM]?$/;
    const pass = typeof received === 'string' && currencyRegex.test(received);
    
    return {
      message: () => `expected ${received} to be a valid currency format`,
      pass
    };
  },
  
  toBeValidPercentage(received) {
    const percentageRegex = /^\d+(\.\d+)?%$/;
    const pass = typeof received === 'string' && percentageRegex.test(received);
    
    return {
      message: () => `expected ${received} to be a valid percentage format`,
      pass
    };
  },
  
  toBeFinanciallyReasonable(received, context = "") {
    // Basic sanity checks for financial values
    const pass = typeof received === 'number' && 
                  isFinite(received) && 
                  !isNaN(received) &&
                  received > -1000000 && // Not unreasonably negative
                  received < 100000000;  // Not unreasonably large
    
    return {
      message: () => `expected ${received} to be a financially reasonable number ${context}`,
      pass
    };
  }
});
EOF

echo "📝 Creating calculation test files..."

# Business calculations tests
cat > tests/calculations/business.test.js << 'EOF'
const {
  calculateCompoundGrowth,
  calculateNPV,
  calculatePresentValue,
  calculateCurrentRatio,
  calculateROE,
  calculateROI
} = require('../../index');

describe('Business Calculations', () => {
  describe('Projections', () => {
    test('calculateCompoundGrowth should work correctly', () => {
      const result = calculateCompoundGrowth(100000, 0.05, 10);
      expect(result).toBeCloseTo(162889.46, 2);
    });

    test('calculatePresentValue should work correctly', () => {
      const result = calculatePresentValue(162889.46, 0.05, 10);
      expect(result).toBeCloseTo(100000, 2);
    });

    test('calculateNPV should work correctly', () => {
      const cashFlows = [10000, 15000, 20000, 25000, 30000];
      const result = calculateNPV(cashFlows, 0.10, 50000);
      expect(result).toBeFinanciallyReasonable();
      expect(result).toBeGreaterThan(0); // Should be positive NPV
    });
  });

  describe('Ratios', () => {
    test('calculateROI should work correctly', () => {
      const result = calculateROI(150000, 100000);
      expect(result).toBe(0.5); // 50% ROI
    });

    test('calculateROE should work correctly', () => {
      const result = calculateROE(50000, 500000);
      expect(result).toBe(0.1); // 10% ROE
    });

    test('calculateCurrentRatio should work correctly', () => {
      const result = calculateCurrentRatio(200000, 100000);
      expect(result).toBe(2.0); // 2:1 ratio
    });

    test('should handle zero values gracefully', () => {
      expect(calculateROI(100000, 0)).toBe(0);
      expect(calculateROE(50000, 0)).toBe(0);
      expect(calculateCurrentRatio(100000, 0)).toBe(0);
    });
  });
});
EOF

# Core calculations tests
cat > tests/calculations/core.test.js << 'EOF'
const {
  calculatePMT,
  calculateRemainingBalance,
  calculateInterestOverTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPriceValue
} = require('../../index');

describe('Core Calculations', () => {
  describe('Loan Calculations', () => {
    test('calculatePMT should work correctly', () => {
      const result = calculatePMT(300000, 0.06, 30);
      expect(result).toBeCloseTo(1798.65, 2);
    });

    test('calculatePMT should handle zero interest', () => {
      const result = calculatePMT(360000, 0, 30);
      expect(result).toBe(1000); // 360k / (30*12) = 1000
    });

    test('calculateRemainingBalance should work correctly', () => {
      const result = calculateRemainingBalance(300000, 0.06, 30, 5);
      expect(result).toBeGreaterThan(250000);
      expect(result).toBeLessThan(300000);
    });

    test('calculateInterestOverTime should work correctly', () => {
      const result = calculateInterestOverTime(300000, 0.06, 30);
      expect(result).toBeGreaterThan(300000); // Interest should be substantial
      expect(result).toBeFinanciallyReasonable();
    });
  });

  describe('Formatting', () => {
    test('formatCurrency should format correctly', () => {
      expect(formatCurrency(1500000)).toBe('$1.5M');
      expect(formatCurrency(75000)).toBe('$75K');
      expect(formatCurrency(999)).toBe('$999');
      expect(formatCurrency(2500, true)).toBe('$2,500');
      expect(formatCurrency(-50000)).toBe('-$50K');
    });

    test('formatCurrency should handle invalid inputs', () => {
      expect(formatCurrency(NaN)).toBe('N/A');
      expect(formatCurrency(Infinity)).toBe('N/A');
    });

    test('formatPercentage should work correctly', () => {
      expect(formatPercentage(0.065)).toBe('6.5%');
      expect(formatPercentage(0.15, 0)).toBe('15%');
      expect(formatPercentage(0.0675, 2)).toBe('6.75%');
    });

    test('formatNumber should work correctly', () => {
      expect(formatNumber(1234.567)).toBe('1,234.57');
      expect(formatNumber(1234.567, 1)).toBe('1,234.6');
    });

    test('formatPriceValue should work correctly', () => {
      expect(formatPriceValue(1500000)).toBe('$2M');
      expect(formatPriceValue(750000)).toBe('$750K');
      expect(formatPriceValue(999)).toBe('$999');
    });
  });
});
EOF

# Date calculations tests
cat > tests/calculations/date.test.js << 'EOF'
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
      expect(calculateDOM('2024-01-15')).toContain('59');
      expect(calculateDOM('1/15/2024')).toBe('59 (01/15/2024)');
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
EOF

# Real estate calculations tests
cat > tests/calculations/real-estate.test.js << 'EOF'
const {
  calculateAppreciation,
  calculateCapRate,
  calculateCashFlow,
  calculateCashFlowYield,
  calculateCOCR,
  calculateCOCR15,
  calculateCOCR30,
  calculateCOCRScenario,
  calculateNetToBuyer,
  calculatePMT
} = require('../../index');

describe('Real Estate Calculations', () => {
  describe('Cash Flow Calculations', () => {
    test('calculateCapRate should work correctly', () => {
      const result = calculateCapRate(60000, 1000000);
      expect(result).toBe(0.06); // 6% cap rate
    });

    test('calculateCashFlow should work correctly', () => {
      const monthlyNOI = 5000;
      const loanAmount = 700000;
      const result = calculateCashFlow(monthlyNOI, loanAmount, 0.075, 30);
      expect(result).toBeFinanciallyReasonable();
    });

    test('calculateCashFlowYield should work correctly', () => {
      const result = calculateCashFlowYield(12000, 1000000);
      expect(result).toBe(0.012); // 1.2% yield
    });
  });

  describe('COCR Calculations', () => {
    test('calculateCOCR should work correctly', () => {
      const result = calculateCOCR(15000, 200000);
      expect(result).toBe(0.075); // 7.5% COCR
    });

    test('calculateCOCR15 should work correctly', () => {
      const result = calculateCOCR15(1000000, 60000, 0.075, 30);
      expect(result).toBeFinanciallyReasonable();
      expect(result).toBeGreaterThan(-0.1); // Should be reasonable
    });

    test('calculateCOCR30 should work correctly', () => {
      const result = calculateCOCR30(1000000, 60000, 0.075, 30);
      const cocr15 = calculateCOCR15(1000000, 60000, 0.075, 30);
      expect(result).toBeFinanciallyReasonable();
      expect(result).toBeGreaterThan(cocr15); // 30% down should have higher COCR
    });

    test('calculateCOCRScenario should work with custom parameters', () => {
      const result = calculateCOCRScenario(1000000, 60000, 0.25, 0.08, 25);
      expect(result).toBeFinanciallyReasonable();
    });
  });

  describe('Cost Calculations', () => {
    test('calculateNetToBuyer should return proper breakdown', () => {
      const result = calculateNetToBuyer(1000000, 0.25);
      
      expect(result).toHaveProperty('downPayment', 250000);
      expect(result).toHaveProperty('netToBuyer');
      expect(result).toHaveProperty('breakdown');
      expect(result.netToBuyer).toBeGreaterThan(250000); // Should include costs
      
      // Verify breakdown structure
      expect(result.breakdown).toHaveProperty('Down Payment');
      expect(result.breakdown).toHaveProperty('Seller Commission');
      expect(result.breakdown).toHaveProperty('Closing Costs');
    });

    test('calculateNetToBuyer should handle custom constants', () => {
      const constants = {
        sellerAgentCommission: 0.03,
        closing: 0.015,
        bridge: 0.04
      };
      
      const result = calculateNetToBuyer(1000000, 0.25, constants);
      expect(result.sellerCommission).toBe(30000); // 3% of 1M
      expect(result.closingCosts).toBe(15000); // 1.5% of 1M
    });
  });

  describe('Appreciation Calculations', () => {
    test('calculateAppreciation should work correctly', () => {
      const result = calculateAppreciation(1000000, 0.03, 5, 100000, 50000);
      
      expect(result).toHaveProperty('futureValue');
      expect(result).toHaveProperty('cashOutAfterRefi');
      expect(result.futureValue).toBeGreaterThan(1000000);
      expect(result.totalOwing).toBe(150000);
    });

    test('calculateAppreciation should handle zero balances', () => {
      const result = calculateAppreciation(1000000, 0.03, 5);
      expect(result.totalOwing).toBe(0);
      expect(result.cashOutAfterRefi).toBeGreaterThan(0);
    });
  });

  describe('DSCR Payment Helper', () => {
    test('should calculate DSCR payment correctly', () => {
      // Helper function referenced in tests
      const calculateDSCRPayment = (askingPrice) => {
        const dscrLoanAmount = askingPrice * 0.70;
        return calculatePMT(dscrLoanAmount, 0.075, 30);
      };

      const result = calculateDSCRPayment(1000000);
      expect(result).toBeWithinRange(4800, 4900); // ~$4,890/month for $700k loan
    });
  });
});
EOF

echo "🌐 Creating DOM utilities test files..."

# Text extraction tests
cat > tests/dom-utilities/extraction.test.js << 'EOF'
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

    test('should return null for no phone number', () => {
      expect(extractPhoneNumber('No phone here')).toBeNull();
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

    test('should return null for no bedroom info', () => {
      expect(extractBedrooms('Nice property')).toBeNull();
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
EOF

# Validation tests
cat > tests/dom-utilities/validation.test.js << 'EOF'
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
EOF

echo "🔗 Creating integration test files..."

# Integration tests
cat > tests/integration/index.test.js << 'EOF'
const utilsPackage = require('../../index');

describe('Integration Tests - Package Exports', () => {
  describe('All Functions Available', () => {
    test('should export all business calculation functions', () => {
      expect(utilsPackage.calculateCompoundGrowth).toBeDefined();
      expect(utilsPackage.calculateNPV).toBeDefined();
      expect(utilsPackage.calculatePresentValue).toBeDefined();
      expect(utilsPackage.calculateCurrentRatio).toBeDefined();
      expect(utilsPackage.calculateROE).toBeDefined();
      expect(utilsPackage.calculateROI).toBeDefined();
    });

    test('should export all core calculation functions', () => {
      expect(utilsPackage.calculatePMT).toBeDefined();
      expect(utilsPackage.calculateRemainingBalance).toBeDefined();
      expect(utilsPackage.calculateInterestOverTime).toBeDefined();
      expect(utilsPackage.formatCurrency).toBeDefined();
      expect(utilsPackage.formatNumber).toBeDefined();
      expect(utilsPackage.formatPercentage).toBeDefined();
      expect(utilsPackage.formatPriceValue).toBeDefined();
    });

    test('should export all date calculation functions', () => {
      expect(utilsPackage.calculateDOM).toBeDefined();
      expect(utilsPackage.calculateTimeDifference).toBeDefined();
    });

    test('should export all real estate calculation functions', () => {
      expect(utilsPackage.calculateAppreciation).toBeDefined();
      expect(utilsPackage.calculateCapRate).toBeDefined();
      expect(utilsPackage.calculateCashFlow).toBeDefined();
      expect(utilsPackage.calculateCashFlowYield).toBeDefined();
      expect(utilsPackage.calculateCOCR).toBeDefined();
      expect(utilsPackage.calculateCOCR15).toBeDefined();
      expect(utilsPackage.calculateCOCR30).toBeDefined();
      expect(utilsPackage.calculateCOCRScenario).toBeDefined();
      expect(utilsPackage.calculateNetToBuyer).toBeDefined();
    });

    test('should export all DOM utility functions', () => {
      expect(utilsPackage.extractBedrooms).toBeDefined();
      expect(utilsPackage.extractEmail).toBeDefined();
      expect(utilsPackage.extractPhoneNumber).toBeDefined();
      expect(utilsPackage.extractPrice).toBeDefined();
      expect(utilsPackage.validateDate).toBeDefined();
      expect(utilsPackage.validateEmail).toBeDefined();
      expect(utilsPackage.validatePhoneNumber).toBeDefined();
    });

    test('should export alias functions', () => {
      expect(utilsPackage.calculateBalloonBalance).toBeDefined();
      expect(utilsPackage.calculateBalloonBalance).toBe(utilsPackage.calculateRemainingBalance);
    });
  });

  describe('Function Types', () => {
    test('all exports should be functions', () => {
      Object.values(utilsPackage).forEach(exportedValue => {
        expect(typeof exportedValue).toBe('function');
      });
    });
  });

  describe('Cross-Function Integration', () => {
    test('should calculate complete real estate scenario', () => {
      const propertyPrice = 1000000;
      const annualNOI = 60000;
      const downPaymentPercent = 0.25;
      
      // Calculate various metrics for same property
      const capRate = utilsPackage.calculateCapRate(annualNOI, propertyPrice);
      const netToBuyer = utilsPackage.calculateNetToBuyer(propertyPrice, downPaymentPercent);
      const cocr30 = utilsPackage.calculateCOCR30(propertyPrice, annualNOI);
      const appreciation = utilsPackage.calculateAppreciation(propertyPrice, 0.03, 5);
      
      // All should return reasonable values
      expect(capRate).toBeCloseTo(0.06, 2);
      expect(netToBuyer.netToBuyer).toBeGreaterThan(250000);
      expect(cocr30).toBeFinanciallyReasonable();
      expect(appreciation.futureValue).toBeGreaterThan(propertyPrice);
    });

    test('should format calculated values correctly', () => {
      const payment = utilsPackage.calculatePMT(300000, 0.06, 30);
      const formattedPayment = utilsPackage.formatCurrency(payment, true);
      const percentage = utilsPackage.formatPercentage(0.06);
      
      expect(formattedPayment).toBeValidCurrency();
      expect(percentage).toBeValidPercentage();
    });
  });
});
EOF

# Update package.json to include jest config reference
echo "📋 Updating package.json..."
# Note: In real implementation, you'd update package.json to reference the jest config

# Create a comprehensive test runner script
cat > tests/run-tests.js << 'EOF'
#!/usr/bin/env node

/**
 * Custom test runner for @archerjessop/utilities-etc
 * Provides additional testing utilities and coverage reports
 */

const { execSync } = require('child_process');
const path = require('path');

// Configuration
const testConfig = {
  configPath: path.join(__dirname, 'setup', 'jest.config.js'),
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

function runTests(options = {}) {
  const {
    watch = false,
    coverage = false,
    verbose = false,
    testFile = null
  } = options;

  let command = `npx jest --config=${testConfig.configPath}`;
  
  if (watch) command += ' --watch';
  if (coverage) command += ' --coverage';
  if (verbose) command += ' --verbose';
  if (testFile) command += ` ${testFile}`;

  console.log(`🧪 Running tests with command: ${command}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  watch: args.includes('--watch'),
  coverage: args.includes('--coverage'),
  verbose: args.includes('--verbose'),
  testFile: args.find(arg => arg.endsWith('.test.js'))
};

runTests(options);
EOF

# Make the test runner executable
chmod +x tests/run-tests.js

echo "📚 Creating test documentation..."

# Test documentation
cat > tests/README.md << 'EOF'
# @archerjessop/utilities-etc Test Suite

Comprehensive test suite for the utilities package covering business calculations, real estate functions, and DOM utilities.

## Setup

Run the setup script to create all test files and directories:

```bash
bash setup-tests.sh
```

## Running Tests

### All tests:
```bash
npm test
```

### Specific test categories:
```bash
# Business calculations
npx jest tests/calculations/business.test.js

# Core functions (loans, formatting)
npx jest tests/calculations/core.test.js

# Date calculations
npx jest tests/calculations/date.test.js

# Real estate calculations
npx jest tests/calculations/real-estate.test.js

# DOM utilities
npx jest tests/dom-utilities/

# Integration tests
npx jest tests/integration/
```

### With coverage:
```bash
npm run test:coverage
```

### Watch mode:
```bash
npm run test:watch
```

### Custom test runner:
```bash
node tests/run-tests.js --coverage --verbose
```

## Test Structure

- **`setup/`** - Jest configuration, custom matchers, test helpers
- **`calculations/`** - All calculation function tests
- **`dom-utilities/`** - Text extraction and validation tests
- **`integration/`** - Cross-function integration tests

## Custom Matchers

- `toBeWithinRange(min, max)` - Check if number is within range
- `toBeCloseToPercentage(expected, tolerance)` - Check percentage values
- `toBeValidCurrency()` - Validate currency format strings
- `toBeValidPercentage()` - Validate percentage format strings
- `toBeFinanciallyReasonable()` - Sanity check for financial values

## Coverage Goals

- Functions: 80%+
- Lines: 80%+
- Branches: 80%+
- Statements: 80%+

## Browser Testing

Tests are configured for `jsdom` environment to simulate Chrome browser APIs for DOM utilities.
EOF

echo "✅ Test suite setup complete!"
echo ""
echo "📁 Created directory structure:"
echo "   tests/"
echo "   ├── setup/"
echo "   │   ├── jest.config.js"
echo "   │   ├── test-helpers.js"
echo "   │   └── custom-matchers.js"
echo "   ├── calculations/"
echo "   │   ├── business.test.js"
echo "   │   ├── core.test.js"
echo "   │   ├── date.test.js"
echo "   │   └── real-estate.test.js"
echo "   ├── dom-utilities/"
echo "   │   ├── extraction.test.js"
echo "   │   └── validation.test.js"
echo "   ├── integration/"
echo "   │   └── index.test.js"
echo "   ├── run-tests.js"
echo "   └── README.md"
echo ""
echo "🚀 To run tests:"
echo "   npm test                              # All tests"
echo "   npm run test:coverage                 # With coverage"
echo "   npm run test:watch                    # Watch mode"
echo "   node tests/run-tests.js --coverage    # Custom runner"
echo ""
echo "📊 Basic happy path tests created for all functions"
echo "💡 You can now expand tests for edge cases and more coverage!"