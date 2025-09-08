// Import custom matchers
require('./custom-matchers');

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
