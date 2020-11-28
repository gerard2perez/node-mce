process.env.TEST = 'test';
jest.mock('../src/fs');
import { resolve } from "path";
import { existsSync, readdirSync, readFileSync, writeFileSync } from '../src/fs';
import { command, loader, reset, restore, subcommand } from "./loader";
import { readLog } from "./log-reader";
//@ts-ignore
readdirSync.mockReturnValue(['utils.ts', 'utils1.ts', 'utils2.ts', 'utils3.ts'])
//@ts-ignore
existsSync.mockReturnValue(true)
describe('Utils functions', ()=>{
	beforeAll(()=>loader('./test'));
	beforeEach(()=>reset());
	afterAll(()=>restore());
    test('gets correct paths', async ()=>{
        let res = await subcommand('utils');
        expect(res).toEqual({
            cli: resolve('./'),
            target: resolve('./'),
        });
    });
    test('test verbosity 0', async () =>{
		await expect(subcommand('utils1'))
			.resolves.toBe(readLog('utils.verbosity.log'));
	});
	test('test verbosity 1', async () =>{
		await expect(subcommand('utils1 -v'))
			.resolves.toBe(readLog('utils.verbosity2.log'));
    });
    test('test verbosity 2', async () =>{
		await expect(subcommand('utils1 -vv'))
			.resolves.toBe(readLog('utils.verbosity3.log'));
	});
	test('test verbosity 3', async () =>{
		await expect(subcommand('utils1 -vvv'))
			.resolves.toBe(readLog('utils.verbosity4.log'));
    });
    test('renders a file', async () =>{
		//@ts-ignore
		readFileSync.mockReturnValue('{{demo}}');
		await expect(subcommand('utils2 -vvv -r'))
			.resolves.toBeDefined();
		expect(writeFileSync).toBeCalledTimes(1);
		expect(writeFileSync).toBeCalledWith(resolve(process.cwd(), './demo.txt'), 'works');
		await expect(subcommand('utils2 -vvv')).resolves.toBe('works');
    });
    test('executes a single command', async () =>{
        await command('-v');
		await command('-h');
		await command('');
		await command('--version');
    });
    test('test override util', async () =>{
		let res:any = await subcommand('utils3 -vvv');
		expect(res).toHaveProperty('information');
		let object = expect(res.information);
		object.toHaveProperty('name','demoapp');
		object.toHaveProperty('bin');
		object.toHaveProperty('main');
		object.toHaveProperty('version');
	});
});