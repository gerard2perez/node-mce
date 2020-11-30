process.env.TEST = 'test';
import { existsSync, readdirSync, readFileSync } from '../src/fs';
import { spawn } from '../src/spawn';
import { findCommands, loader, reset, restore, subcommand, subCommandWithModule } from './loader';
import { readLog } from './log-reader';
jest.mock('../src/fs');
jest.mock('../src/spawn');
jest.mock('../src/fs');
jest.mock('../src/spawn');
//@ts-ignore
existsSync.mockReturnValue(false);
//@ts-ignore
readFileSync.mockReturnValue('');
//@ts-ignore
readdirSync.mockReturnValue([]);
describe('Self Test', ()=>{
	beforeAll(()=>loader('./src'));
	beforeEach(()=>reset());
	afterAll(()=>restore());
	test('renders help', async()=>{
		await expect(subcommand('new --version'))
				.resolves
				.toMatch(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/);
    });
    test('create a new project', async()=>{
		findCommands('new.ts');
		// @ts-ignore
		spawn.mockReturnValueOnce(Promise.resolve(''))
			.mockReturnValueOnce(Promise.resolve('gerard2perez@outlook.com'))
			.mockReturnValueOnce(Promise.resolve('gerard2p'))
			.mockReturnValue(Promise.resolve(true));
		await expect(subcommand('new single_repo -f -s single'))
			.resolves.toBe(readLog('new.output.log'));
    });
    test('create a new project multicommand', async()=>{
		findCommands('new.ts');
		// @ts-ignore
		spawn.mockReturnValue(Promise.resolve('gerard2p'))
			.mockReturnValue(Promise.resolve('gerard2perez@gmail'));
		await expect(subcommand('new git_repo -f -s git'))
				.resolves.toBe(readLog('new-git.output.log'));
    });
    test('command does not exist', async()=>{
		await expect(subcommand('trim'))
				.resolves.toBe('Command does not exists\n');
	});
    test('renders all help', async()=>{
		findCommands('new.ts', 'add.ts');
		await expect(subcommand('-h'))
			.resolves
			.toBe(readLog('all.help.log'));
    });
    test('renders command help', async()=>{
		findCommands('new.ts');
		await expect(subcommand('new -h'))
			.resolves
			.toBe(readLog('new.help.log'));
	});
	test('renders help for add command', async () => {
		findCommands('add.ts');
		await expect(subcommand('add -h'))
			.resolves
			.toBe(readLog('add.help.log'));
	});
	test('adds a dummy command fails', async () => {
		findCommands('add.ts');
		await expect(subcommand('add dummy'))
			.resolves
			.toBe(readLog('add.fail.log'));
	});
	test('adds a dummy command', async () => {
		findCommands('add.ts');
		//@ts-ignore
		existsSync.mockReturnValue(true);
		await expect(subcommand('add dummy'))
			.resolves
			.toBe(readLog('add.log'));

	});
});
