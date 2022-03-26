jest.mock('cross-spawn')
jest.mock('@gerard2p/mce/mockable/spawn-streams')
jest.mock('@gerard2p/mce/mockable/fs')
jest.mock('chokidar')
jest.mock('glob')
import { find, Execute, Reset, Restore, SetProjectPath,  } from './@utils/loader'
import { readLog } from './@utils/log-reader'
import { mockSpawn } from '@gerard2p/mce/test/spawn'
import { readFileSync } from '@gerard2p/mce/mockable/fs'
import * as $tree from '@gerard2p/mce/test/tree-maker'
import { pack } from '@gerard2p/mce/test/package-json'
import cspawn from 'cross-spawn'
import { SpawnStreams } from '@gerard2p/mce/mockable/spawn-streams'
import { input, mockOverride, STDOut } from '@gerard2p/mce/test'
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
describe('Self Test (new)', () => {
	beforeAll(() => SetProjectPath('./src'))
	beforeEach(() => {
		Reset()
		find.commands('new.ts', 'add.ts', 'build')
	})
	afterAll(() => Restore())
    test('create a new project', async() => {
		mockSpawn((stdout, stderr) => {
			stderr.emit('data', Buffer.from(''))
			return 1
		})
		mockSpawn('gerard2perez@outlook.com')
		mockSpawn('gerard2p')
		pack({version: '2.0.0'})
		buildTree()
		mockSpawn((stdout, stderr) => {
			stdout.emit('data', Buffer.from('line1'))
			stderr.emit('data', Buffer.from('line2'))
			stdout.emit('data', Buffer.from('line3'))
			return 0
		})
		mockSpawn('done')
		await expect(Execute('mce new single_repo -nf -s single'))
			.resolves.toBe(readLog('new.output.log'))
		expect(cspawn).toBeCalledTimes(5)
	})
	test('cancel project override', async() => {
		mockOverride(false, false)
		wait(10).then(_ => input.write('n'))
		await expect(Execute('mce new single_repo -s single'))
			.resolves.toBeDefined()
		expect(cspawn).toBeCalledTimes(0)
	})
	test('create a new project (dry run)', async() => {
		readFileSync.mockReturnValue(JSON.stringify({}))
		SpawnStreams.mockReturnValue(['pipe', new STDOut, new STDOut])
		await expect(Execute('mce new single_repo -fn -s single --dry-run'))
			.resolves.toBe(readLog('new.output.log'))
		expect(cspawn).toBeCalledTimes(0)
    })
    test('create a new project multicommand', async() => {
		mockSpawn('gerard2p')
		mockSpawn('gerard2perez@gmail')
		mockSpawn((stdout, stderr) => {
			stderr.emit('data', 'fails')
			return 1
		})
		mockSpawn((stdout, stderr) => {
			stderr.emit('data', 'fails')
			return 1
		})
		pack()
		buildTree(false)
		await expect(Execute('mce new git_repo -f -s -n git'))
				.resolves.toBe(readLog('new-git.output.log'))
    })
    test('renders command help', async() => {
		await expect(Execute('mce new -h'))
			.resolves
			.toBe(readLog('new.help.log'))
	})
})
