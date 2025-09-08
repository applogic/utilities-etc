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
