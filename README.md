# @archerjessop/utilities-etc

Comprehensive set of DOM manipulation, data extraction utilities, and various calculations (financial and otherwise) for our web applications.

## Updating

Make your changes then, depending on the changes:

For bug fixes (backward compatible):

```bash
npm run release:patch
```
→ bumps 1.0.0 → 1.0.1

For new features (still backward compatible):
```bash
npm run release:minor
```
→ bumps 1.0.0 → 1.1.0

For breaking changes:
```bash
npm run release:major
```
→ bumps 1.0.0 → 2.0.0

Each script will:
- Update package.json version
- Commit the version bump + create a git tag
- Push commit + tag to your repo
- Publish the new version to npm

## Installation

```bash
npm install @archerjessop/utilities-etc
```

## Usage

```javascript
const {
  calculateDOM,
  extractPhoneNumber,
  extractBedrooms,
  validatePhoneNumber,
  calculatePMT,
  formatCurrency
} = require("@archerjessop/utilities-etc");

// Calculate days on market
const dom = calculateDOM("01/15/2024");
console.log(dom); // "59 (01/15/2024)"

// Extract phone number from text
const phone = extractPhoneNumber("Call us at (555) 123-4567");
console.log(phone); // "(555) 123-4567"

// Calculate loan payment
const payment = calculatePMT(300000, 0.075, 30);
console.log(formatCurrency(payment, true)); // "$2,097"
```

## Comprehensive API Reference

### Business Calculations

#### `calculateCompoundGrowth(initialValue, growthRate, periods)`
Calculate compound growth over time
- **Input**: Initial value (number), growth rate (decimal), number of periods (number)
- **Output**: Future value (number)

#### `calculateCurrentRatio(currentAssets, currentLiabilities)`
Calculate current ratio for liquidity analysis
- **Input**: Current assets (number), current liabilities (number)
- **Output**: Current ratio (number)

#### `calculateNPV(cashFlows, discountRate, initialInvestment)`
Calculate Net Present Value of cash flows
- **Input**: Cash flows array (number[]), discount rate (decimal), initial investment (number, optional)
- **Output**: Net present value (number)

#### `calculatePresentValue(futureValue, discountRate, periods)`
Calculate present value of future amount
- **Input**: Future value (number), discount rate (decimal), number of periods (number)
- **Output**: Present value (number)

#### `calculateROE(netIncome, shareholderEquity)`
Calculate Return on Equity
- **Input**: Net income (number), shareholder equity (number)
- **Output**: ROE as decimal (number)

#### `calculateROI(gain, cost)`
Calculate Return on Investment
- **Input**: Gain from investment (number), cost of investment (number)
- **Output**: ROI as decimal (number)

### Core Utilities

#### `calculateInterestOverTime(principal, annualRate, years)`
Calculate total interest paid over loan life
- **Input**: Principal amount (number), annual rate (decimal), years (number)
- **Output**: Total interest (number)

#### `calculatePMT(principal, annualRate, years)`
Calculate monthly loan payment (PMT function)
- **Input**: Principal amount (number), annual rate (decimal), years (number)
- **Output**: Monthly payment (number)

#### `calculateRemainingBalance(principal, annualRate, totalYears, yearsPaid)`
Calculate remaining loan balance after payments
- **Input**: Principal (number), annual rate (decimal), total years (number), years paid (number)
- **Output**: Remaining balance (number)

#### `calculateBalloonBalance(principal, annualRate, totalYears, yearsPaid)`
Alias for calculateRemainingBalance - calculate balloon payment amount
- **Input**: Principal (number), annual rate (decimal), total years (number), years paid (number)
- **Output**: Balloon balance (number)

#### `formatCurrency(amount, isMonthly)`
Format currency with K/M notation or full amount for monthly payments
- **Input**: Amount (number), is monthly flag (boolean, optional)
- **Output**: Formatted currency string (string)

#### `formatNumber(value, decimals)`
Format number with commas and specified decimal places
- **Input**: Value (number), decimal places (number, default 2)
- **Output**: Formatted number string (string)

#### `formatPercentage(value, decimals)`
Format decimal as percentage
- **Input**: Decimal value (number), decimal places (number, default 1)
- **Output**: Formatted percentage string (string)

#### `formatPriceValue(price)`
Format price with K/M notation for display
- **Input**: Price value (number)
- **Output**: Formatted price string (string)

### Date Utilities

#### `calculateDOM(dateString)`
Calculate days on market from listing date
- **Input**: Date string in various formats (string)
- **Output**: Formatted DOM string with days and original date (string)

#### `calculateTimeDifference(startDate, endDate)`
Calculate time difference between two dates
- **Input**: Start date (string|Date), end date (string|Date, optional - defaults to now)
- **Output**: Object with days, hours, minutes, and formatted string (object)

### DOM/Text Extraction

#### `extractBedrooms(text)`
Extract bedroom count from text or DOM
- **Input**: Text to search (string, optional - uses document.body if not provided)
- **Output**: Number of bedrooms or default value (number)

#### `extractEmail(text)`
Extract email addresses from text or DOM
- **Input**: Text to search (string, optional - uses document.body if not provided)
- **Output**: Array of email addresses found (string[])

#### `extractPhoneNumber(text)`
Extract phone number from text or DOM
- **Input**: Text to search (string, optional - uses document.body if not provided)
- **Output**: Phone number or "Not found" (string)

#### `extractPrice(text)`
Extract price values from text or DOM
- **Input**: Text to search (string, optional - uses document.body if not provided)
- **Output**: Array of price values found (number[])

### Real Estate Calculations

#### `calculateAppreciation(currentPrice, appreciationRate, years, balloonBalance, dscrBalance, refiPercent)`
Calculate property appreciation scenarios with refinance analysis
- **Input**: Current price (number), appreciation rate (decimal), years (number), balloon balance (number, optional), DSCR balance (number, optional), refi percentage (decimal, optional)
- **Output**: Object with future value, refi amount, total owing, cash out (object)

#### `calculateCapRate(annualNOI, propertyPrice)`
Calculate capitalization rate
- **Input**: Annual NOI (number), property price (number)
- **Output**: Cap rate as decimal (number)

#### `calculateCashFlow(monthlyNOI, loanAmount, interestRate, amortizationYears)`
Calculate monthly cash flow after debt service
- **Input**: Monthly NOI (number), loan amount (number), interest rate (decimal), amortization years (number)
- **Output**: Monthly cash flow (number)

#### `calculateCashFlowYield(annualCashFlow, propertyPrice)`
Calculate cash flow yield as percentage of property price
- **Input**: Annual cash flow (number), property price (number)
- **Output**: Cash flow yield as decimal (number)

#### `calculateCOCR(annualCashFlow, downPayment)`
Calculate Cash-on-Cash Return
- **Input**: Annual cash flow (number), down payment amount (number)
- **Output**: COCR as decimal (number)

#### `calculateCOCR15(propertyPrice, annualNOI, interestRate, amortizationYears)`
Calculate COCR for 15% down payment scenario
- **Input**: Property price (number), annual NOI (number), interest rate (decimal, default 0.075), amortization years (number, default 30)
- **Output**: COCR as decimal (number)

#### `calculateCOCR30(propertyPrice, annualNOI, interestRate, amortizationYears)`
Calculate COCR for 30% down payment scenario
- **Input**: Property price (number), annual NOI (number), interest rate (decimal, default 0.075), amortization years (number, default 30)
- **Output**: COCR as decimal (number)

#### `calculateCOCRScenario(propertyPrice, annualNOI, downPaymentPercent, interestRate, amortizationYears)`
Calculate COCR for custom down payment scenario
- **Input**: Property price (number), annual NOI (number), down payment percent (decimal), interest rate (decimal, default 0.075), amortization years (number, default 30)
- **Output**: COCR as decimal (number)

#### `calculateNetToBuyer(propertyPrice, downPaymentPercent, constants)`
Calculate net amount buyer needs with all costs
- **Input**: Property price (number), down payment percent (decimal), constants object (object, optional)
- **Output**: Object with cost breakdown and net to buyer (object)

### Validation

#### `validateDate(dateString)`
Validate if string is a valid date
- **Input**: Date string (string)
- **Output**: True if valid date (boolean)

#### `validateEmail(email)`
Validate email address format
- **Input**: Email address (string)
- **Output**: True if valid email format (boolean)

#### `validatePhoneNumber(phoneNumber)`
Validate phone number format
- **Input**: Phone number (string)
- **Output**: True if valid phone number format (boolean)

## Browser Support

Works in both Node.js and browser environments. In browser environments, functions can extract data directly from the DOM when no text parameter is provided.

## License

MIT