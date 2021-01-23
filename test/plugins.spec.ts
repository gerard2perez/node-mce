import { Reset, Restore, SetProjectPath, WithPlugins } from './@utils/loader'
import { readLog } from './@utils/log-reader'
jest.unmock('@gerard2p/mce/mockable/fs')
describe('Self Test #2', () => {
	beforeAll(() => SetProjectPath('./test/demo_project'))
	beforeEach(() => {
		Reset()
		// findCommands('')
	})
	afterAll(() => Restore())
	test('Can load local commands using the plugin namespace', async() => {
		await expect(WithPlugins('test-commands', 'l:args -h'))
			.resolves
			.toBe(readLog('local-args.help.log'))
	})
	test('Catches error and parses SourceMap', async () => {
		expect(true)
		await expect(WithPlugins('test-commands', 'module:sourcemap')).rejects.toThrow('from main context')
		await expect(WithPlugins('test-commands', 'module:sourcemap -s')).rejects.toThrow('from spinner')
		process.env.MCE_TRACE = 'true'
		await expect(WithPlugins('test-commands', 'module:sourcemap')).rejects.toThrow('from main context')
		await expect(WithPlugins('test-commands', 'module:sourcemap -s')).rejects.toThrow('from spinner')
		process.env.MCE_TRACE_SHOWINTERNAL = 'true'
		process.env.MCE_TRACE_SHOWMCE = 'true'
		await expect(WithPlugins('test-commands', 'module:sourcemap')).rejects.toThrow('from main context')
		// await expect(WithPlugins('test-commands', 'module:sourcemap -s')).rejects.toThrow('from spinner')
	})
	test('test commands in folders', async () => {
		await expect(WithPlugins('test-commands', 'module:complex'))
			.resolves
			.toEqual({opt: true})
	})
})