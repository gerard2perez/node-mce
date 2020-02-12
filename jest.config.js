module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    "templates"
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
