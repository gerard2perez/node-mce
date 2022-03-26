/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: integration.test.ts
Created:  2022-03-25T21:01:32.011Z
Modified: 2022-03-25T21:09:17.282Z
*/

jest.mock('cross-spawn')
jest.mock('@gerard2p/mce/mockable/spawn-streams')
jest.mock('@gerard2p/mce/mockable/fs')
jest.mock('chokidar')
jest.mock('glob')
import { find, Execute, Reset, Restore, SetProjectPath,  } from './@utils/loader'
import { readLog } from './@utils/log-reader'
describe('Self Test', () => {
	beforeAll(() => SetProjectPath('./src'))
	beforeEach(() => {
		Reset()
		find.commands('new.ts', 'add.ts', 'build')
	})
	afterAll(() => Restore())
	test('renders version', async() => {
		await expect(Execute('mce new --version'))
				.resolves
				.toMatch(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)
    })
    test('command does not exist', async() => {
		await expect(Execute('mce trim'))
				.rejects.toThrowError()
	})
    test('renders all help', async() => {
		await expect(Execute('mce -h'))
			.resolves
			.toBe(readLog('all.help.log'))
	})
})
