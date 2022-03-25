jest.mock('cross-spawn')
jest.mock('@gerard2p/mce/mockable/spawn-streams')
jest.mock('@gerard2p/mce/mockable/fs')
jest.mock('chokidar')
jest.mock('glob')
import { findCommands, Execute, Reset, Restore, SetProjectPath,  } from './@utils/loader'
import { readLog } from './@utils/log-reader'
import { mockSpawn } from '@gerard2p/mce/test/spawn'
import { existsSync, readFileSync, unlinkSync, } from '@gerard2p/mce/mockable/fs'
import * as $tree from '@gerard2p/mce/test/tree-maker'
import { pack } from '@gerard2p/mce/test/package-json'
import cspawn from 'cross-spawn'
import { SpawnStreams } from '@gerard2p/mce/mockable/spawn-streams'
import { input, mockOverride, STDOut } from '@gerard2p/mce/test'
import { join } from 'path'
import { wait } from '@gerard2p/mce/spinner'
function buildTree(optional = true) {
	$tree.root(
		$tree.cpy(),
		$tree.cpy(),
		$tree.cpy(),
		$tree.cmp({he: 626}),
		$tree.cmp({he: 627}),
		$tree.dir(
			$tree.wrt(),
			optional && $tree.cpy(),
			!optional && $tree.dir($tree.cpy())
		),
		$tree.dir(
			$tree.cpy(),
			$tree.cpy(),
			$tree.cpy()
		),
		$tree.pkg(),
		$tree.cpy(),
	)
}
describe('Self Test', () => {
	beforeAll(() => SetProjectPath('./src'))
	beforeEach(() => {
		Reset()
		findCommands('new.ts', 'add.ts', 'build')
	})
	afterAll(() => Restore())
	// test('renders version', async() => {
	// 	await expect(Execute('mce new --version'))
	// 			.resolves
	// 			.toMatch(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)
    // })
    // test('create a new project', async() => {
	// 	mockSpawn((stdout, stderr) => {
	// 		stderr.emit('data', Buffer.from(''))
	// 		return 1
	// 	})
	// 	mockSpawn('gerard2perez@outlook.com')
	// 	mockSpawn('gerard2p')
	// 	pack({version: '2.0.0'})
	// 	buildTree()
	// 	mockSpawn((stdout, stderr) => {
	// 		stdout.emit('data', Buffer.from('line1'))
	// 		stderr.emit('data', Buffer.from('line2'))
	// 		stdout.emit('data', Buffer.from('line3'))
	// 		return 0
	// 	})
	// 	mockSpawn('done')
	// 	await expect(Execute('mce new single_repo -f -s single'))
	// 		.resolves.toBe(readLog('new.output.log'))
	// 	expect(cspawn).toBeCalledTimes(5)
	// })
	// test('cancel project override', async() => {
	// 	mockOverride(false, false)
	// 	wait(10).then(_ => input.write('n'))
	// 	await expect(Execute('mce new single_repo -s single'))
	// 		.resolves.toBeDefined()
	// 	expect(cspawn).toBeCalledTimes(0)
	// })
	// test('create a new project (dry run)', async() => {
	// 	readFileSync.mockReturnValue(JSON.stringify({}))
	// 	SpawnStreams.mockReturnValue(['pipe', new STDOut, new STDOut])
	// 	await expect(Execute('mce new single_repo -fn -s single --dry-run'))
	// 		.resolves.toBe(readLog('new.output.log'))
	// 	expect(cspawn).toBeCalledTimes(0)
    // })
    // test('create a new project multicommand', async() => {
	// 	mockSpawn('gerard2p')
	// 	mockSpawn('gerard2perez@gmail')
	// 	mockSpawn((stdout, stderr) => {
	// 		stderr.emit('data', 'fails')
	// 		return 1
	// 	})
	// 	mockSpawn((stdout, stderr) => {
	// 		stderr.emit('data', 'fails')
	// 		return 1
	// 	})
	// 	pack()
	// 	buildTree(false)
	// 	await expect(Execute('mce new git_repo -f -s -n git'))
	// 			.resolves.toBe(readLog('new-git.output.log'))
    // })
    // test('command does not exist', async() => {
	// 	await expect(Execute('mce trim'))
	// 			.rejects.toThrowError()
	// })
    test('renders all help', async() => {
		await expect(Execute('mce -h'))
			.resolves
			.toBe(readLog('all.help.log'))
	})
    // test('renders command help', async() => {
	// 	_____
	// 	await expect(Execute('mce new -h'))
	// 		.resolves
	// 		.toBe(readLog('new.help.log'))
	// })
	// test('renders help for add command', async () => {
	// 	_____
	// 	await expect(Execute('mce add -h'))
	// 		.resolves
	// 		.toBe(readLog('add.help.log'))
	// })
	// test('adds a dummy command fails', async () => {
	// 	_____
	// 	await expect(Execute('mce add dummy'))
	// 		.resolves
	// 		.toBe(readLog('add.fail.log'))
	// })
	// test('adds a dummy command', async () => {
	// 	_____
	// 	existsSync.mockReturnValueOnce(true)
	// 	await expect(Execute('mce add dummy'))
	// 		.resolves
	// 		.toBe(readLog('add.log'))
	// })
})
// describe('Self Test - Build Command', () => {
// 	beforeAll(() => SetProjectPath('./src'))
// 	beforeEach(() => Reset())
// 	afterAll(() => Restore())
// 	test('default commands', async () => {
// 		const { sync } = await import('glob')

// 		_____
// 		pack({includes: ['**/*.ts'], compilerOptions: {}})
// 		existsSync.mockReturnValueOnce(true)
// 		pack({ bin: { mce: './mce'}, compilerOptions: {}})
// 		sync.mockReturnValueOnce(['mce'])

// 		sync.mockReturnValueOnce(['templates/one.ts'])
// 		sync.mockReturnValueOnce(['package.json', 'README.md', 'LICENSE'])
// 		sync.mockReturnValueOnce(['mce'])
// 		sync.mockReturnValueOnce(undefined)
// 		mockSpawn('')

// 		await expect(Execute('mce build additional'))
// 			.resolves. toBeDefined()

// 		expect(readFileSync).toHaveBeenNthCalledWith(1, join(__dirname, '../src/tsconfig.json'), 'utf-8')
// 		expect(existsSync).toHaveBeenNthCalledWith(1, './incremental.tsbuildinfo')
// 		expect(unlinkSync).toBeCalledWith('./incremental.tsbuildinfo')
// 		expect(readFileSync).toHaveBeenNthCalledWith(2, join(__dirname, '../src/package.json'), 'utf-8')
// 	})
// 	test('watch mode', async () => {
// 		const { sync } = await import('glob')
// 		const { watch } = await import('chokidar')
		
// 		readFileSync.mockRestore()
// 		existsSync.mockRestore()
// 		unlinkSync.mockRestore()

// 		_____

// 		pack({
// 			extends: 'tsconfig.build.json',
// 			includes: ['**/*.ts'],
// 			compilerOptions: {}
// 		})
// 		pack({
// 			compilerOptions: {
// 				outDir: './lib'
// 			}
// 		})
// 		existsSync.mockReturnValueOnce(false)
// 		pack({ bin: { mce: './mce'}, compilerOptions: {}})
// 		sync.mockReturnValueOnce(['mce'])

// 		sync.mockReturnValueOnce(['templates/one.ts'])
// 		sync.mockReturnValueOnce(['package.json', 'README.md', 'LICENSE'])
// 		sync.mockReturnValueOnce(['mce'])
// 		sync.mockReturnValueOnce(undefined)

// 		watch.mockReturnValue({on(){
// 			return this
// 		}})
// 		mockSpawn('')
// 		await expect(Execute('mce build additional -w'))
// 			.resolves. toBeDefined()

// 		expect(readFileSync).toHaveBeenNthCalledWith(1, join(__dirname, '../src/tsconfig.json'), 'utf-8')
// 		expect(readFileSync).toHaveBeenNthCalledWith(2, join(__dirname, '../src/tsconfig.build.json'), 'utf-8')
// 		expect(existsSync).toHaveBeenNthCalledWith(1, './incremental.tsbuildinfo')
// 		expect(unlinkSync).toBeCalled()
// 		expect(readFileSync).toHaveBeenNthCalledWith(3, join(__dirname, '../src/package.json'), 'utf-8')
// 	})
// })