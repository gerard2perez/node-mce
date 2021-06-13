import type { Config } from '@jest/types'
const config: Config.InitialOptions = {
	verbose: true,
	testEnvironment: 'node',
	preset: 'ts-jest',
	maxWorkers: 1,
	forceExit: true,
	moduleNameMapper: {
		'^@gerard2p/mce$': '<rootDir>/src',
		'^@gerard2p/mce/(.*)$': '<rootDir>/src/$1',
	},
	modulePathIgnorePatterns: ['<rootDir>/lib/'],
	coverageThreshold: {
		global: {
			branches: 98,
			functions: 99,
			lines: 99,
			statements: 99,
		},
	},
	testPathIgnorePatterns: [
		'templates',
		'node_modules',
		'coverage',
		'lib',
	],
	coverageDirectory: './coverage',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{ts,tsx}'],
	coveragePathIgnorePatterns: [
		'src/verbose',
		'/node_modules/',
		'src/cli.ts',
		'src/commands/build/incremental.ts',
		'src/test/tree-maker.ts',
		'src/spinner/',
	],
	coverageReporters: ['html', 'json', 'lcov'],
}

export default config
