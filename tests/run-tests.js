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
