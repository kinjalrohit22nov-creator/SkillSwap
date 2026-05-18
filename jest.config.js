const path = require('path')

module.exports = {
  projects: [
    {
      displayName: 'web',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/apps/web/**/*.test.{js,ts,jsx,tsx}'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/web/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/apps/web/jest.setup.js'],
    },
    {
      displayName: 'user-service',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/services/user-service/**/*.test.js'],
    },
    {
      displayName: 'match-service',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/services/match-service/**/*.test.js'],
    },
    {
      displayName: 'session-service',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/services/session-service/**/*.test.js'],
    },
    {
      displayName: 'token-service',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/services/token-service/**/*.test.js'],
    },
    {
      displayName: 'ai-service',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/services/ai-service/**/*.test.js'],
    },
  ],
  collectCoverageFrom: [
    'apps/*/src/**/*.{js,ts,tsx}',
    'services/*/src/**/*.js',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
}
