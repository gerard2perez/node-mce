import { Reset, Restore, SetProjectPath, Execute } from './@utils/loader'
import { readLog } from './@utils/log-reader'
const options = {
	plugins: 'test-commands',
	locals: 'test-commands',
}
describe('Self Test #2', () => {
	beforeAll(() => {
		jest.unmock('@gerard2p/mce/mockable/fs')
		SetProjectPath('./test/demo_project')
	})
	beforeEach(() => {
		Reset()
	})
	afterAll(() => {
		Restore()
		jest.mock('@gerard2p/mce/mockable/fs')
	})
	test('Can load local commands using the plugin namespace', async() => {
		await expect(Execute('demo l:args -h', options))
			.resolves
			.toBe(readLog('local-args.help.log'))
	})
	test('Catches error and parses SourceMap', async () => {
		await expect(Execute('demo module:sourcemap', options)).rejects.toThrow('from main context')
		await expect(Execute('demo module:sourcemap -s', options)).rejects.toThrow('from spinner')
		// process.env.MCE_TRACE = 'true'
		// await expect(Execute('demo test-commands', 'module:sourcemap')).rejects.toThrow('from main context')
		// await expect(Execute('demo test-commands', 'module:sourcemap -s')).rejects.toThrow('from spinner')
		// process.env.MCE_TRACE_SHOWINTERNAL = 'true'
		// process.env.MCE_TRACE_SHOWMCE = 'true'
		// await expect(Execute('demo test-commands', 'module:sourcemap')).rejects.toThrow('from main context')
	})
	test('test commands in folders', async () => {
		await expect(Execute('demo module:complex', options))
			.resolves
			.toEqual({opt: true})
	})
})