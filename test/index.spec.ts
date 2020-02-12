
process.env.TEST = 'test';
jest.mock('../src/fs');
jest.mock('../src/spawn');
import { existsSync, readFileSync } from '../src/fs';
import { spawn } from '../src/spawn';
import { loader, subcommand, subCommandWithModule } from './loader';
import { readLog } from './log-reader';
//@ts-ignore
readFileSync.mockReturnValue('');
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
		await expect(subcommand('new single_repo -f -s single'))
			.resolves.toBe(readLog('new.output.log'));
    });
    test('create a new project multicommand', async()=>{
		await expect(subcommand('new git_repo -f -s git'))
				.resolves.toBe(readLog('new-git.output.log'));
    });
    test('command does not exist', async()=>{
		await expect(subcommand('trim'))
				.resolves.toBe('Command does not exists\n');
	});
    test('renders all help', async()=>{
		await expect(subcommand('-h'))
			.resolves
			.toBe(readLog('all.help.log'));
    });
    test('renders command help', async()=>{
		await expect(subcommand('new -h'))
			.resolves
			.toBe(readLog('new.help.log'));
	});
	test('renders help for add command', async () => {
		await expect(subcommand('add -h'))
			.resolves
			.toBe(readLog('add.help.log'));
	});
	test('adds a dummy command fails', async () => {
		const result = readLog('add.fail.log');
		loader('./src');
		process.chdir('./test/sandbox/');
		await expect(subcommand('add dummy'))
			.resolves
			.toBe(result);
		process.chdir('../../');
	});
	test('adds a dummy command', async () => {
		//@ts-ignore
		existsSync.mockReturnValue(true);
		const result = readLog('add.log');
		loader('./src');
		process.chdir('./test');
		await expect(subcommand('add dummy'))
			.resolves
			.toBe(result);
		process.chdir('..');
		//@ts-ignore
		existsSync.mockReturnValue(false);
	});
	test('loads submodules', async()=>{
		process.chdir('test');
		await subCommandWithModule('test.json', 'submodule');
	});
});