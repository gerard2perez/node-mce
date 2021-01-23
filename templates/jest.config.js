module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  maxWorkers: 1,
  coverageThreshold: {
    "global": {
      "branches": 90,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  },
  modulePathIgnorePatterns: [
    '<rootDir>/lib/'
  ],
  testPathIgnorePatterns: [
    "templates",
    "node_modules",
    "coverage",
    "lib"
  ],
  coverageDirectory: "./coverage",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/cli.ts",
    "src/spinner/"
  ],
  "coverageReporters": [
    "html",
    "json",
    "lcov"
  ]
};
