module.exports = {
  preset: 'ts-jest',
  "maxWorkers": 1,
  "coverageThreshold": {
    "global": {
      "branches": 99,
      "functions": 99,
      "lines": 99,
      "statements": 99
    }
  },
  testPathIgnorePatterns: [
    "templates",
    "node_modules",
    "coverage",
    "lib"
  ],
  testEnvironment: 'node',
  coverageDirectory: "./coverage",
  "collectCoverage": true,
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}"
	],
	coveragePathIgnorePatterns : [
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
