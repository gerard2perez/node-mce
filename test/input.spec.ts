jest.mock('@gerard2p/mce/mockable/fs')
import { confirm, override, question } from '@gerard2p/mce/input'
import { existsSync } from '@gerard2p/mce/mockable/fs'
import { spin, wait } from '@gerard2p/mce/spinner'
import { input, output, Reset, Restore, SetProjectPath } from './@utils/loader'
import { mockOverride } from '@gerard2p/mce/test'
describe('test user interactions', () => {
	beforeAll(() => SetProjectPath('./test/demo_project'))
	beforeEach(() => Reset())
	afterAll(() => Restore())
	test('question', async () => {
		const w = wait(10).then(_ => input.write('Gerardo Perez'))
		const message = expect(wait(5).then(_ => output.read())).resolves.toBe('what\'s your name? ')
		await expect(question('what\'s your name?')).resolves.toBe('Gerardo Perez')
		await Promise.all([w, message])
	})
	test('question inside spin', async () => {
		await spin('test', async () => {
			await wait(10)
			const w = wait(10).then(_ => input.write('Julius Levart'))
			const message = expect(wait(5).then(_ => output.read())).resolves.toBe('ℹ test - really? ')
			await expect(question('really?')).resolves.toBe('Julius Levart')
			await Promise.all([w, message])
		})
	})
	test('confirm', async() => {
		let w = wait(10).then(_ => input.write('y'))
		let message = expect(wait(5).then(_ => output.read())).resolves.toBe('Did you ate pancakes? [y/n]: ')
		await expect(confirm('Did you ate pancakes')).resolves.toBeTruthy()
		await Promise.all([w, message])

		w = wait(10).then(_ => input.write('n'))
		message = expect(wait(5).then(_ => output.read())).resolves.toBe('Did you drank milk? [y/n]: ')
		await expect(confirm('Did you drank milk')).resolves.toBeFalsy()
		await Promise.all([w, message])
	})

	test('ask for folder override', async () => {
		mockOverride(false, false)
		let w = wait(10).then(_ => input.write('n'))
		await expect(override('Do you want to continue', 'fake_folder', false)).resolves.toBeFalsy()
		await w

		mockOverride(true, false)
		w = wait(10).then(_ => input.write('y'))
		await expect(override('Do you want to continue', 'fake_folder', false)).resolves.toBeTruthy()
		await w
		
		mockOverride(false, true)
		await expect(override('Do you want to continue', 'fake_folder', true)).resolves.toBeTruthy()
		existsSync.mockReturnValue(false)
	})
})
