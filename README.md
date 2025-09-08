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
  validatePhoneNumber
} = require('@archerjessop/utilities-etc');

// Calculate days on market
const dom = calculateDOM('01/15/2024');
console.log(dom); // "59 (01/15/2024)"

// Extract phone number from text
const phone = extractPhoneNumber('Call us at (555) 123-4567');
console.log(phone); // "(555) 123-4567"

// Extract bedroom count
const bedrooms = extractBedrooms('This 15 bedroom property...');
console.log(bedrooms); // 15

// Validate phone number
const isValid = validatePhoneNumber('(555) 123-4567');
console.log(isValid); // true
```

## API Reference

### Date Utilities
- `calculateDOM(dateString)` - Calculate days on market from listing date
- `calculateTimeDifference(startDate, endDate)` - Calculate time difference between dates

### Extraction Utilities  
- `extractPhoneNumber(text)` - Extract phone numbers from text or DOM
- `extractBedrooms(text)` - Extract bedroom count from text
- `extractEmail(text)` - Extract email addresses from text
- `extractPrice(text)` - Extract price values from text

### Validation Utilities
- `validatePhoneNumber(phone)` - Validate phone number format
- `validateEmail(email)` - Validate email format  
- `validateDate(dateString)` - Validate date string

## Browser Support

Works in both Node.js and browser environments. In browser environments, functions can extract data directly from the DOM when no text parameter is provided.

## License

MIT
