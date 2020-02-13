process.env.TEST = 'test';
jest.mock('../src/fs');
import { existsSync, readFileSync, readdirSync, writeFileSync } from '../src/fs';
import { resolve } from "path";
import { command, subcommand } from "./loader";
import { readLog } from "./log-reader";

describe('Utils functions', ()=>{
    test('gets correct paths', async ()=>{
        let res = await subcommand('utils');
        expect(res).toEqual({
            cli: resolve('./test'),
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
    test('renders a file', async () =>{
		//@ts-ignore
		readFileSync.mockReturnValue('{{demo}}');
		
		await expect(subcommand('utils2 -vvv -r'))
			.resolves.toBeDefined();
		expect(writeFileSync).toBeCalledTimes(1);
		expect(writeFileSync).toBeCalledWith(resolve(process.cwd(), './test/demo.txt'), 'works');
		await expect(subcommand('utils2 -vvv')).resolves.toBe('works');
    });
    test('executes a single command', async () =>{
        await command('-v');
		await command('-h');
		await command('');
		await command('--version');
    });
    // test('test override util', async () =>{
    //     let res = await subcommand('utils3 -vvv');
	// 	// expect(res).toMatchObject({res:'true'});
	// 	console.log(res);
	// });
});