process.env.TEST = 'test'
import { Reset, Restore, SetProjectPath, WithPlugins } from './loader'
import { readLog } from './log-reader'

describe('Self Test #2', () => {
	beforeAll(() => SetProjectPath('./test'))
	beforeEach(() => Reset())
	afterAll(() => Restore())
	test('Can load local commands using the plugin namespace', async() => {
		expect(true)
		await expect(WithPlugins('test-commands', 'l:args -h'))
			.resolves
			.toBe(readLog('local-args.help.log'))
	})
})