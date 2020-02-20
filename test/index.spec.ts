process.env.TEST = 'test';
import { loader, subcommand, subCommandWithModule } from './loader';
jest.mock('../src/fs');
jest.mock('../src/spawn');
import { existsSync, readFileSync, readdirSync } from '../src/fs';
import { spawn } from '../src/spawn';
import { readLog } from './log-reader';
//@ts-ignore
readFileSync.mockReturnValue('');
//@ts-ignore
readdirSync.mockReturnValue([]);
//@ts-ignore
spawn.mockReturnValue(Promise.resolve(true));
describe('Self Test', ()=>{
	test('renders help', async()=>{
		await expect(subcommand('new --version'))
				.resolves
				.toMatch(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/);
    });
    test('create a new project', async()=>{
		loader('./src');
		//@ts-ignore
		existsSync.mockReturnValue(true);
		//@ts-ignore
		readdirSync.mockReturnValueOnce(['new.ts'])
		await expect(subcommand('new single_repo -f -s single'))
			.resolves.toBe(readLog('new.output.log'));
			//@ts-ignore
		existsSync.mockReturnValue(false);
    });
    test('create a new project multicommand', async()=>{
		//@ts-ignore
		existsSync.mockReturnValue(true);
		//@ts-ignore
		readdirSync.mockReturnValueOnce(['new.ts'])
		await expect(subcommand('new git_repo -f -s git'))
				.resolves.toBe(readLog('new-git.output.log'));
				//@ts-ignore
		existsSync.mockReturnValue(false);
    });
    test('command does not exist', async()=>{
		await expect(subcommand('trim'))
				.resolves.toBe('Command does not exists\n');
	});
    test('renders all help', async()=>{
		//@ts-ignore
		readdirSync.mockReturnValueOnce(['new.ts', 'add.ts'])
		await expect(subcommand('-h'))
			.resolves
			.toBe(readLog('all.help.log'));
    });
    test('renders command help', async()=>{
		//@ts-ignore
		readdirSync.mockReturnValueOnce(['new.ts'])
		await expect(subcommand('new -h'))
			.resolves
			.toBe(readLog('new.help.log'));
	});
	test('renders help for add command', async () => {
		//@ts-ignore
		readdirSync.mockReturnValueOnce(['add.ts'])
		await expect(subcommand('add -h'))
			.resolves
			.toBe(readLog('add.help.log'));
	});
	test('adds a dummy command fails', async () => {
		//@ts-ignore
		readdirSync.mockReturnValueOnce(['add.ts'])
		const result = readLog('add.fail.log');
		await expect(subcommand('add dummy'))
			.resolves
			.toBe(result);
	});
	test('adds a dummy command', async () => {
		//@ts-ignore
		readdirSync.mockReturnValueOnce(['add.ts'])
		//@ts-ignore
		existsSync.mockReturnValue(true);
		const result = readLog('add.log');
		loader('./src');
		await expect(subcommand('add dummy'))
			.resolves
			.toBe(result);
		//@ts-ignore
		existsSync.mockReturnValue(false);
	});
	test('loads submodules', async()=>{
		process.chdir('test')
		//@ts-ignore
		existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
		await subCommandWithModule('test.json', 'submodule');
		//@ts-ignore
		existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
		await subCommandWithModule('test.json', 'submodule');
		//@ts-ignore
		existsSync.mockReturnValueOnce(false);
		await subCommandWithModule('test.json', 'submodule');
		process.chdir('..')
	});
});