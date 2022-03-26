jest.mock('cross-spawn')
jest.mock('@gerard2p/mce/mockable/spawn-streams')
jest.mock('@gerard2p/mce/mockable/fs')
jest.mock('chokidar')
jest.mock('glob')
import { Reset, Restore, SetProjectPath, Execute, find } from './@utils/loader'
import { readLog } from './@utils/log-reader'
const options = {
	plugins: 'test-commands',
	locals: 'test-commands',
}
describe('Self Test #2', () => {
	beforeAll(() => {
		SetProjectPath('./test/demo_project')
	})
	beforeEach(() => {
		Reset()
		find.commands('options', 'utils')
			.plugins({
				'module': ['complex', 'sourcemap'],
				'module2': ['submodule']
			})
			.locals('args')
	})
	afterAll(() => {
		Restore()
	})
	test('Can load local commands using the plugin namespace', async() => {
		await expect(Execute('demo l:args -h', options))
			.resolves
			.toBe(readLog('local-args.help.log'))
	})
	test('Catches error and parses SourceMap', async () => {
		await expect(Execute('demo module:sourcemap', options)).rejects.toThrow('from main context')
	})
	test('Catches error and parses SourceMap', async () => {
		await expect(Execute('demo module:sourcemap -s', options)).rejects.toThrow('from spinner')
	})
	test('test commands in folders', async () => {
		await expect(Execute('demo module:complex', options))
			.resolves
			.toEqual({opt: true})
	})
})
