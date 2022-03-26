/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: integration.add.test.ts
Created:  2022-03-25T20:55:07.159Z
Modified: 2022-03-26T02:13:47.226Z
*/
jest.mock('cross-spawn')
jest.mock('@gerard2p/mce/mockable/spawn-streams')
jest.mock('@gerard2p/mce/mockable/fs')
jest.mock('chokidar')
jest.mock('glob')
import { find, Execute, Reset, Restore, SetProjectPath,  } from './@utils/loader'
import { readLog } from './@utils/log-reader'
import { existsSync } from '@gerard2p/mce/mockable/fs'
describe('Self Test (add)', () => {
	beforeAll(() => SetProjectPath('./src'))
	beforeEach(() => {
		Reset()
		find.commands('new.ts', 'add.ts', 'build')
	})
	afterAll(() => Restore())
	test('renders help for add command', async () => {
		await expect(Execute('mce add -h'))
			.resolves
			.toBe(readLog('add.help.log'))
	})
	test('adds a dummy command fails', async () => {
		await expect(Execute('mce add dummy --out ./src'))
			.rejects.toThrowError(/This command does not support this options:.*/)
	})
	test('adds a dummy command', async () => {
		existsSync.mockReturnValueOnce(true)
		await expect(Execute('mce add dummy'))
			.resolves
			.toBe(readLog('add.log'))
	})
})
