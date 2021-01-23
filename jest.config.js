module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  maxWorkers: 1,
  moduleNameMapper: {
    '^@gerard2p/mce$': '<rootDir>/src',
    '^@gerard2p/mce/(.*)$': '<rootDir>/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/lib/'
  ],
  coverageThreshold: {
    'global': {
      'branches': 98,
      'functions': 99,
      'lines': 99,
      'statements': 99
    }
  },
  testPathIgnorePatterns: [
    'src/commands/build/*',
    'templates',
    'node_modules',
    'coverage',
    'lib'
  ],
  coverageDirectory: './coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}'
  ],
  coveragePathIgnorePatterns: [
    'src/verbose',
    'src/commands/build/*',
    '/node_modules/',
    'src/cli.ts',
    'src/spinner/'
  ],
  'coverageReporters': [
    'html',
    'json',
    'lcov'
  ]
}
