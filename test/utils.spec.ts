jest.mock('@gerard2p/mce/mockable/fs')
import { findCommands, GitStyle, Reset, Restore, SetProjectPath, SingleStyle } from './@utils/loader'
import { readLog } from './@utils/log-reader'
import { existsSync, readFileSync, writeFileSync } from '@gerard2p/mce/mockable/fs'
import { dirname, join, resolve } from 'path'
existsSync.mockReturnValue(true)
describe('Utils functions', () => {
	beforeAll(() => SetProjectPath('./test/demo_project'))
	beforeEach(() => {
		Reset()
		findCommands('utils.ts', 'utils1.ts', 'utils2.ts', 'utils3.ts')
	})
	afterAll(() => Restore())
    test('gets correct paths', async () => {
        const res = await GitStyle('utils')
        expect(res).toEqual({
            cli: join(__dirname, 'demo_project'),
            target: join(__dirname, 'demo_project'),
        })
    })
    test('test verbosity 0', async () => {
		await expect(GitStyle('utils1'))
			.resolves.toBe(readLog('utils.verbosity.log'))
	})
	test('test verbosity 1', async () => {
		await expect(GitStyle('utils1 -v'))
			.resolves.toBe(readLog('utils.verbosity2.log'))
    })
    test('test verbosity 2', async () => {
		await expect(GitStyle('utils1 -vv'))
			.resolves.toBe(readLog('utils.verbosity3.log'))
	})
	// test('test verbosity 3', async () => {
	// 	await expect(GitStyle('utils1 -vvv'))
	// 		.resolves.toBe(readLog('utils.verbosity4.log'))
    // })
    // test('renders a file', async () => {
	// 	readFileSync.mockReturnValue('{{demo}}')
	// 	await expect(GitStyle('utils2 -vvv -r'))
	// 		.resolves.toBeDefined()
	// 	expect(writeFileSync).toBeCalledTimes(1)
	// 	expect(writeFileSync).toBeCalledWith(resolve(dirname(__dirname), 'test/demo_project', './demo.txt'), 'works')
	// 	await expect(GitStyle('utils2 -vvv')).resolves.toBeDefined()
    // })
    // test('executes a single command', async () => {
    //     await SingleStyle('-v')
	// 	await SingleStyle('-h')
	// 	await SingleStyle('')
	// 	await SingleStyle('--version')
    // })
    // test('test override util', async () => {
	// 	const res: any = await GitStyle('utils3 -vvv')
	// 	expect(res).toHaveProperty('information')
	// 	const object = expect(res.information)
	// 	object.toHaveProperty('name', 'demoapp')
	// 	object.toHaveProperty('bin')
	// 	object.toHaveProperty('main')
	// 	object.toHaveProperty('version')
	// })
})