// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  testPathIgnorePatterns: [

    // '<rootDir>/src/common', '<rootDir>/src/domains/dashboard', '<rootDir>/src/services', '<rootDir>/src/domains/console/AdminLogin', '<rootDir>/src/domains/console/DataApiSection', '<rootDir>/src/domains/console/Header','<rootDir>/src/domains/console/SchemaManagerSection', '<rootDir>/src/domains/console/Sidebar', '<rootDir>/src/domains/login'
],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.tsx',
    '!./**/*.stories.tsx',
  './src/services/**/*.ts'
],
  testEnvironment: 'jest-environment-jsdom'
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)