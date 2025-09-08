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
