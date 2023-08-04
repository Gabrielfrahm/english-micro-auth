/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  displayName: {
    name: 'app',
    color: 'blue',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  rootDir: '.',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.ts?$': '@swc/jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  globalSetup: './jest.global-setup.ts',
  globalTeardown: './jest.global-teardown.ts',
};

export default config;
