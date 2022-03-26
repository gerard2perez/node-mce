/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: integration.build.test.ts
Created:  2022-03-25T19:24:15.828Z
Modified: 2022-03-26T00:35:31.950Z
*/

jest.mock('cross-spawn')
jest.mock('@gerard2p/mce/mockable/spawn-streams')
jest.mock('@gerard2p/mce/mockable/fs')
jest.mock('chokidar')
jest.mock('glob')
import { find, Execute, Reset, Restore, SetProjectPath,  } from './@utils/loader'
import { mockSpawn } from '@gerard2p/mce/test/spawn'
import { existsSync, readFileSync, unlinkSync, } from '@gerard2p/mce/mockable/fs'
import { pack } from '@gerard2p/mce/test/package-json'
import { join } from 'path'
describe('Self Test (build)', () => {
	beforeAll(() => SetProjectPath('./src'))
	beforeEach(() => {
		Reset()
		find.commands('new.ts', 'add.ts', 'build')
	})
	afterAll(() => Restore())
	test('default commands', async () => {
		const { sync } = await import('glob')
		pack({includes: ['**/*.ts'], compilerOptions: {}})
		existsSync.mockReturnValueOnce(true)
		pack({ bin: { mce: './mce'}, compilerOptions: {}})
		sync.mockReturnValueOnce(['mce'])

		sync.mockReturnValueOnce(['templates/one.ts'])
		sync.mockReturnValueOnce(['package.json', 'README.md', 'LICENSE'])
		sync.mockReturnValueOnce(['mce'])
		sync.mockReturnValueOnce(undefined)
		mockSpawn('')

		await expect(Execute('mce build additional'))
			.resolves. toBeDefined()

		expect(readFileSync).toHaveBeenNthCalledWith(1, join(__dirname, '../src/tsconfig.json'), 'utf-8')
		expect(existsSync).toHaveBeenNthCalledWith(1, './incremental.tsbuildinfo')
		expect(unlinkSync).toBeCalledWith('./incremental.tsbuildinfo')
		expect(readFileSync).toHaveBeenNthCalledWith(2, join(__dirname, '../src/package.json'), 'utf-8')
	})
	test('watch mode', async () => {
		const { sync } = await import('glob')
		const { watch } = await import('chokidar')
		
		readFileSync.mockRestore()
		pack({
			extends: 'tsconfig.build.json',
			includes: ['**/*.ts'],
			compilerOptions: {}
		})
		existsSync.mockReturnValueOnce(true)
		unlinkSync.mockRestore()
		pack({
			compilerOptions: {
				outDir: './lib'
			}
		})
		existsSync.mockReturnValueOnce(false)
		pack({ bin: { mce: './mce'}, compilerOptions: {}})
		sync.mockReturnValueOnce(['mce'])

		sync.mockReturnValueOnce(['templates/one.ts'])
		sync.mockReturnValueOnce(['package.json', 'README.md', 'LICENSE'])
		sync.mockReturnValueOnce(['mce'])
		sync.mockReturnValueOnce(undefined)

		watch.mockReturnValue({on(){
			return this
		}})
		mockSpawn('')
		await expect(Execute('mce build additional -w'))
			.resolves. toBeDefined()

		expect(readFileSync).toHaveBeenNthCalledWith(1, join(__dirname, '../src/tsconfig.json'), 'utf-8')
		expect(readFileSync).toHaveBeenNthCalledWith(2, join(__dirname, '../src/tsconfig.build.json'), 'utf-8')
		expect(existsSync).toHaveBeenNthCalledWith(1, './incremental.tsbuildinfo')
		expect(unlinkSync).toBeCalled()
		expect(readFileSync).toHaveBeenNthCalledWith(3, join(__dirname, '../src/package.json'), 'utf-8')
	})
})