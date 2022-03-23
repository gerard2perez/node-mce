import type { Config } from '@jest/types'
process.env.MCE_TEST = 'test'
const config: Config.InitialOptions = {
	verbose: true,
	testEnvironment: 'node',
	preset: 'ts-jest',
	maxWorkers: 1,
	globals: {
        'ts-jest': {
            'diagnostics': false,
            'tsconfig': 'test/tsconfig.json'
        }
    },
	forceExit: true,
	moduleNameMapper: {
		'^@gerard2p/mce$': '<rootDir>/src',
		'^@gerard2p/mce/(.*)$': '<rootDir>/src/$1',
	},
	modulePathIgnorePatterns: ['<rootDir>/lib/'],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
	testPathIgnorePatterns: [
		'templates',
		'node_modules',
		'coverage',
		'lib',
		'test/arguments.spec.ts',
		'test/input.spec.ts',
		'test/integration.spec.ts',
		'test/options.spec.ts',
		'test/plugins.spec.ts'
	],
	coverageDirectory: './coverage',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coveragePathIgnorePatterns: [
		'src/core',
		'src/completition',
		'src/dt',
		'src/formatters',
		'src/executer.ts',
		'src/director.ts',
		'src/module-loader',
		'test/',
		'src/verbose',
		'/node_modules/',
		'index.ts',
		'src/cli.ts',
		'src/commands/build/incremental.ts',
		'src/test/tree-maker.ts',
		'src/mockable/fs.ts',
		'src/spinner/',
	],
	coverageReporters: ['html', 'json', 'lcov'],
}

export default config
