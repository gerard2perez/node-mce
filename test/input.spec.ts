process.env.TEST = 'test'
jest.mock('../src/fs')
import { existsSync, readdirSync } from '../src/fs'
import { confirm, override, question } from '../src/input'
import { spin, wait } from '../src/spinner'
import { input, output, Reset, Restore, SetProjectPath } from './@utils/loader'

describe('test user interactions', () => {
	beforeAll(() => SetProjectPath('./test'))
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
			const w = wait(10).then(_ => input.write('Julius Levart'))
			const message = expect(wait(5).then(_ => output.read())).resolves.toBe('i test - really? ')
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
		//@ts-ignore
		existsSync.mockReturnValue(true)
		//@ts-ignore
		readdirSync.mockReturnValue([])
		let w = wait(10).then(_ => input.write('n'))
		await expect(override('Do you want to continue', 'fake_folder', false)).resolves.toBeFalsy()
		await w

		w = wait(10).then(_ => input.write('y'))
		await expect(override('Do you want to continue', 'fake_folder', false)).resolves.toBeTruthy()
		await w
		
		await expect(override('Do you want to continue', 'fake_folder', true)).resolves.toBeTruthy()
		//@ts-ignore
		existsSync.mockReturnValue(false)
	})
})
