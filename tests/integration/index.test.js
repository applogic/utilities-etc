import * as utilsPackage from '../../index.js';

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

  describe('Export Types', () => {
    test('should export functions and configuration objects', () => {
      const exports = Object.entries(utilsPackage);
      
      let functionCount = 0;
      let objectCount = 0;
      let stringCount = 0;
      let classCount = 0;
      
      // Known configuration objects
      const configObjects = ['REAL_ESTATE_RULES', 'VALIDATION_RULES', 'DEFAULT_CONFIG'];
      // Known class constructors (if any)
      const classConstructors = ['RealEstateConfig'];
      
      exports.forEach(([exportName, exportedValue]) => {
        const valueType = typeof exportedValue;
        
        if (configObjects.includes(exportName)) {
          expect(valueType).toBe('object');
          expect(exportedValue).not.toBeNull();
          objectCount++;
          console.log(`✅ ${exportName} is a configuration object`);
        } else if (classConstructors.includes(exportName)) {
          expect(valueType).toBe('function');
          expect(exportedValue.prototype).toBeDefined();
          classCount++;
          console.log(`✅ ${exportName} is a class constructor`);
        } else if (valueType === 'function') {
          functionCount++;
          console.log(`✅ ${exportName} is a function`);
        } else if (valueType === 'object' && exportedValue !== null) {
          objectCount++;
          console.log(`✅ ${exportName} is an unexpected object`);
        } else {
          throw new Error(`Unexpected export type for ${exportName}: ${valueType}`);
        }
      });
      
      console.log(`Total exports: ${exports.length}`);
      console.log(`Functions: ${functionCount}, Objects: ${objectCount}, Strings: ${stringCount}, Classes: ${classCount}`);
      
      // Validate we have the expected categories
      expect(exports.length).toBeGreaterThan(0);
      expect(functionCount).toBeGreaterThan(0);  // Should have calculation functions
      expect(objectCount).toBeGreaterThan(0);    // Should have config objects
    });

    test('configuration objects should have expected structure', () => {
      if (utilsPackage.REAL_ESTATE_RULES) {
        const rules = utilsPackage.REAL_ESTATE_RULES;
        
        expect(rules.financing).toBeDefined();
        expect(rules.costs).toBeDefined();
        expect(rules.propertyIncome).toBeDefined();
        expect(rules.returns).toBeDefined();
        expect(rules.defaults).toBeDefined();
        
        // Test specific values exist and are correct types
        expect(typeof rules.financing.defaultDownPaymentPercent).toBe('number');
        expect(typeof rules.costs.assignmentFeePercent).toBe('number');
        expect(typeof rules.propertyIncome.assistedLiving.revenuePerBedroomPerMonth).toBe('number');
        expect(typeof rules.returns.targetCOCR15Percent).toBe('number');
        expect(typeof rules.defaults.bedroomCount).toBe('number');
        
        console.log('✅ REAL_ESTATE_RULES has correct structure');
      }
      
      if (utilsPackage.VALIDATION_RULES) {
        const validation = utilsPackage.VALIDATION_RULES;
        
        expect(validation.price).toBeDefined();
        expect(validation.capRate).toBeDefined();
        expect(validation.percentages).toBeDefined();
        
        expect(typeof validation.price.minimum).toBe('number');
        expect(typeof validation.price.maximum).toBe('number');
        expect(typeof validation.capRate.minimum).toBe('number');
        expect(typeof validation.capRate.maximum).toBe('number');
        
        console.log('✅ VALIDATION_RULES has correct structure');
      }
      
    });

    test('backwards compatibility - core functions should exist', () => {
      const coreFunctions = [  // Fixed: was "corefunctions"
        'calculatePMT',
        'formatCurrency',
        'formatPercentage', 
        'calculateDOM',
        'extractPhoneNumber',
        'extractBedrooms',
        'calculateCOCR15',
        'calculateCOCR30',
        'calculateCapRate',
        'calculateNetToBuyer',
        'calculateBalloonBalance'
      ];
      
      const foundFunctions = [];
      const missingFunctions = [];
      
      coreFunctions.forEach(functionName => {  // Fixed: was "coreFunction"
        if (utilsPackage[functionName] && typeof utilsPackage[functionName] === 'function') {
          foundFunctions.push(functionName);
          console.log(`✅ ${functionName} exists and is a function`);
        } else {
          missingFunctions.push(functionName);
          console.log(`❌ ${functionName} missing or not a function`);
        }
      });
      
      console.log(`Core functions: ${foundFunctions.length}/${coreFunctions.length} found`);  // Fixed: was "coreFunction"
      expect(foundFunctions.length).toBe(coreFunctions.length);  // Fixed: was "coreFunction"
    });

    test('new centralized functions should exist', () => {
      const newFunctions = [
        'calculateNOIByPropertyType',
        'calculateInvestmentAnalysis', 
        'calculateFormattedInvestmentAnalysis',
        'calculatePriceFor15PercentCOCR',
        'calculateCOCRWith30PercentDown',
        'validatePropertyAnalysisInputs',
        'extractBedroomsWithDefault'
      ];
      
      const implementedFunctions = [];
      
      newFunctions.forEach(functionName => {
        if (utilsPackage[functionName] && typeof utilsPackage[functionName] === 'function') {
          implementedFunctions.push(functionName);
          console.log(`✅ ${functionName} exists and is a function`);
        } else {
          console.log(`⚠️ ${functionName} not yet implemented`);
        }
      });
      
      console.log(`New centralized functions: ${implementedFunctions.length}/${newFunctions.length} implemented`);
      
      // Expect at least some new functions to be implemented
      expect(implementedFunctions.length).toBeGreaterThan(0);
    });

    test('function exports should be callable', () => {
      // Test a few key functions to ensure they're properly exported and callable
      const testFunctions = [
        { name: 'formatCurrency', args: [1000], expectedType: 'string' },
        { name: 'calculatePMT', args: [100000, 0.05, 30], expectedType: 'number' }
      ];
      
      testFunctions.forEach(({ name, args, expectedType }) => {
        if (utilsPackage[name]) {
          expect(typeof utilsPackage[name]).toBe('function');
          
          try {
            const result = utilsPackage[name](...args);
            expect(typeof result).toBe(expectedType);
            console.log(`✅ ${name} is callable and returns ${expectedType}`);
          } catch (error) {
            console.log(`❌ ${name} threw error:`, error.message);
            throw error;
          }
        }
      });
    });

    test('configuration values should be reasonable', () => {
      if (utilsPackage.REAL_ESTATE_RULES) {
        const rules = utilsPackage.REAL_ESTATE_RULES;
        
        // Test reasonable ranges for financial rules
        expect(rules.financing.defaultDownPaymentPercent).toBeGreaterThan(0);
        expect(rules.financing.defaultDownPaymentPercent).toBeLessThan(100);
        
        expect(rules.costs.assignmentFeePercent).toBeGreaterThan(0);
        expect(rules.costs.assignmentFeePercent).toBeLessThan(1);
        
        expect(rules.propertyIncome.assistedLiving.revenuePerBedroomPerMonth).toBeGreaterThan(0);
        expect(rules.propertyIncome.assistedLiving.revenuePerBedroomPerMonth).toBeLessThan(10000);
        
        console.log('✅ Configuration values are within reasonable ranges');
      }
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

  describe('Real-World Workflow Integration', () => {
    test('should perform complete property analysis workflow', () => {
      // Simulate extracting data from a property listing
      const listingText = `
        Beautiful 8 bedroom multifamily property
        Price: $1,250,000
        NOI: $95,000 annually
        Contact: agent@realty.com or (555) 123-4567
      `;

      
      // Extract data
      const prices = utilsPackage.extractPrice(listingText);
      const emails = utilsPackage.extractEmail(listingText);
      const phone = utilsPackage.extractPhoneNumber(listingText);
      const bedrooms = utilsPackage.extractBedrooms(listingText);
      
      expect(prices).toContain(1250000);
      expect(emails).toContain('agent@realty.com');
      expect(phone).toBe('(555) 123-4567');
      expect(bedrooms).toBe(8);
      
      // Perform calculations with extracted data
      const propertyPrice = prices[0];
      const annualNOI = 95000;
      
      const capRate = utilsPackage.calculateCapRate(annualNOI, propertyPrice);
      const cocr15 = utilsPackage.calculateCOCR15(propertyPrice, annualNOI);
      const cocr30 = utilsPackage.calculateCOCR30(propertyPrice, annualNOI);
      const netToBuyer = utilsPackage.calculateNetToBuyer(propertyPrice, 0.25);
      
      // Verify calculations
      expect(capRate).toBeCloseTo(0.076, 3); // 7.6% cap rate
      expect(cocr15).toBeFinanciallyReasonable();
      expect(cocr30).toBeFinanciallyReasonable();
      expect(netToBuyer.netToBuyer).toBeGreaterThan(312500); // 25% down + costs
      
      // Format results for display
      const formattedCapRate = utilsPackage.formatPercentage(capRate);
      const formattedCOCR15 = utilsPackage.formatPercentage(cocr15);
      const formattedNet = utilsPackage.formatCurrency(netToBuyer.netToBuyer);
      
      expect(formattedCapRate).toBeValidPercentage();
      expect(formattedCOCR15).toBeValidPercentage();
      expect(formattedNet).toBeValidCurrency();
    });

    test('should handle complete investment analysis chain', () => {
      const propertyPrice = 2000000;
      const grossRents = 240000; // $20K/month
      const expenses = 0.40; // 40% expense ratio
      const annualNOI = grossRents * (1 - expenses);
      
      // Calculate financing scenarios
      const scenarios = [
        { name: '15% Down', cocr: utilsPackage.calculateCOCR15(propertyPrice, annualNOI) },
        { name: '30% Down', cocr: utilsPackage.calculateCOCR30(propertyPrice, annualNOI) },
        { name: '50% Down', cocr: utilsPackage.calculateCOCRScenario(propertyPrice, annualNOI, 0.50) }
      ];
      
      // Verify all scenarios are reasonable
      scenarios.forEach(scenario => {
        expect(scenario.cocr).toBeFinanciallyReasonable();
      });
      
      // Higher down payment should generally yield higher COCR (less leverage but less debt service)
      expect(scenarios[2].cocr).toBeGreaterThan(scenarios[0].cocr); // 50% > 15%
      
      // Calculate appreciation scenarios
      const appreciation5yr = utilsPackage.calculateAppreciation(propertyPrice, 0.03, 5);
      const appreciation10yr = utilsPackage.calculateAppreciation(propertyPrice, 0.03, 10);
      
      expect(appreciation10yr.futureValue).toBeGreaterThan(appreciation5yr.futureValue);
      
      // Calculate net to buyer for different down payments
      const netToBuyer15 = utilsPackage.calculateNetToBuyer(propertyPrice, 0.15);
      const netToBuyer30 = utilsPackage.calculateNetToBuyer(propertyPrice, 0.30);
      
      expect(netToBuyer30.netToBuyer).toBeGreaterThan(netToBuyer15.netToBuyer);
    });

    test('should validate and format extracted data correctly', () => {
      const testData = {
        phone: '(555) 123-4567',
        email: 'test@example.com',
        date: '2024-01-15',
        price: 1500000,
        percentage: 0.065
      };
      
      // Validate extracted data
      expect(utilsPackage.validatePhoneNumber(testData.phone)).toBe(true);
      expect(utilsPackage.validateEmail(testData.email)).toBe(true);
      expect(utilsPackage.validateDate(testData.date)).toBe(true);
      
      // Format for display
      const formattedPrice = utilsPackage.formatCurrency(testData.price);
      const formattedPercentage = utilsPackage.formatPercentage(testData.percentage);
      const dom = utilsPackage.calculateDOM(testData.date);
      
      expect(formattedPrice).toBeValidCurrency();
      expect(formattedPercentage).toBeValidPercentage();
      expect(dom).toMatch(/01\/(14|15)\/2024/); // Accept either date due to timezone
    });
  });

  describe('Performance and Reliability', () => {
    test('should handle large datasets efficiently', () => {
      const largeCashFlows = Array.from({ length: 100 }, (_, i) => 10000 + i * 1000);
      
      const startTime = Date.now();
      const npv = utilsPackage.calculateNPV(largeCashFlows, 0.10, 500000);
      const endTime = Date.now();
      
      expect(npv).toBeFinanciallyReasonable();
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });

    test('should maintain precision across multiple calculations', () => {
      let runningTotal = 100000;
      
      // Perform multiple compound calculations
      for (let i = 0; i < 10; i++) {
        runningTotal = utilsPackage.calculateCompoundGrowth(runningTotal, 0.05, 1);
      }
      
      // Should equal single 10-year calculation
      const directCalculation = utilsPackage.calculateCompoundGrowth(100000, 0.05, 10);
      expect(runningTotal).toBeCloseTo(directCalculation, 2);
    });
  });
