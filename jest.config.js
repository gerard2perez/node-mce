module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: "./coverage",
  "collectCoverage": true,
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}"
	],
	coveragePathIgnorePatterns : [
		"/node_modules/",
		"/src/server.ts",
		"/src/middleware/"
	],
    "coverageReporters": [
      "html",
	  "json",
	  "lcov"
    ]
};
