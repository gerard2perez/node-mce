jest.mock('@gerard2p/mce/mockable/fs')
import { findCommands, GitStyle, Reset, Restore, SetProjectPath } from './@utils/loader'
import { readLog } from './@utils/log-reader'
import { existsSync, readdirSync, readFileSync } from '@gerard2p/mce/mockable/fs'
import { mockSpawn } from '@gerard2p/mce/test/spawn'

//@ts-ignore
existsSync.mockReturnValue(false)
//@ts-ignore
readFileSync.mockReturnValue('')
//@ts-ignore
readdirSync.mockReturnValue([])
describe('Self Test', () => {
	beforeAll(() => SetProjectPath('./src'))
	beforeEach(() => Reset())
	afterAll(() => Restore())
	test('renders help', async() => {
		await expect(GitStyle('new --version'))
				.resolves
				.toMatch(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)
    })
    test('create a new project', async() => {
		findCommands('new.ts')
		mockSpawn((stdout, stderr) => {
			stderr.emit('data', Buffer.from(''))
			return 1
		})
		mockSpawn('gerard2perez@outlook.com')
		mockSpawn('gerard2p')
		mockSpawn((stdout, stderr) => {
			stdout.emit('data', Buffer.from('line1'))
			stderr.emit('data', Buffer.from('line2'))
			stdout.emit('data', Buffer.from('line3'))
			return 0
		})
		await expect(GitStyle('new single_repo -f -s single'))
			.resolves.toBe(readLog('new.output.log'))
    })
    test('create a new project multicommand', async() => {
		findCommands('new.ts')
		mockSpawn('gerard2p')
		mockSpawn('gerard2perez@gmail')
		mockSpawn('true')
		mockSpawn((stdout, stderr) => {
			stderr.emit('data', 'fails')
			return 1
		})
		await expect(GitStyle('new git_repo -f -s -n git'))
				.resolves.toBe(readLog('new-git.output.log'))
    })
    test('command does not exist', async() => {
		await expect(GitStyle('trim'))
				.resolves.toBe('Command does not exists\n')
	})
    test('renders all help', async() => {
		findCommands('new.ts', 'add.ts')
		await expect(GitStyle('-h'))
			.resolves
			.toBe(readLog('all.help.log'))
    })
    test('renders command help', async() => {
		findCommands('new.ts')
		await expect(GitStyle('new -h'))
			.resolves
			.toBe(readLog('new.help.log'))
	})
	test('renders help for add command', async () => {
		findCommands('add.ts')
		await expect(GitStyle('add -h'))
			.resolves
			.toBe(readLog('add.help.log'))
	})
	test('adds a dummy command fails', async () => {
		findCommands('add.ts')
		await expect(GitStyle('add dummy'))
			.resolves
			.toBe(readLog('add.fail.log'))
	})
	test('adds a dummy command', async () => {
		findCommands('add.ts')
		//@ts-ignore
		existsSync.mockReturnValue(true)
		await expect(GitStyle('add dummy'))
			.resolves
			.toBe(readLog('add.log'))

	})
})
