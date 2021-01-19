process.env.TEST = 'test';
jest.mock('../src/fs');
import { resolve } from "path";
import { existsSync, readdirSync, readFileSync, writeFileSync } from '../src/fs';
import { SingleStyle, SetProjectPath, Reset, Restore, GitStyle } from "./loader";
import { readLog } from "./log-reader";
//@ts-ignore
readdirSync.mockReturnValue(['utils.ts', 'utils1.ts', 'utils2.ts', 'utils3.ts'])
//@ts-ignore
existsSync.mockReturnValue(true)
describe('Utils functions', ()=>{
	beforeAll(()=>SetProjectPath('./test'));
	beforeEach(()=>Reset());
	afterAll(()=>Restore());
    test('gets correct paths', async ()=>{
        let res = await GitStyle('utils');
        expect(res).toEqual({
            cli: resolve('./'),
            target: resolve('./'),
        });
    });
    test('test verbosity 0', async () =>{
		await expect(GitStyle('utils1'))
			.resolves.toBe(readLog('utils.verbosity.log'));
	});
	test('test verbosity 1', async () =>{
		await expect(GitStyle('utils1 -v'))
			.resolves.toBe(readLog('utils.verbosity2.log'));
    });
    test('test verbosity 2', async () =>{
		await expect(GitStyle('utils1 -vv'))
			.resolves.toBe(readLog('utils.verbosity3.log'));
	});
	test('test verbosity 3', async () =>{
		await expect(GitStyle('utils1 -vvv'))
			.resolves.toBe(readLog('utils.verbosity4.log'));
    });
    test('renders a file', async () =>{
		//@ts-ignore
		readFileSync.mockReturnValue('{{demo}}');
		await expect(GitStyle('utils2 -vvv -r'))
			.resolves.toBeDefined();
		expect(writeFileSync).toBeCalledTimes(1);
		expect(writeFileSync).toBeCalledWith(resolve(process.cwd(), './demo.txt'), 'works');
		await expect(GitStyle('utils2 -vvv')).resolves.toBe('works');
    });
    test('executes a single command', async () =>{
        await SingleStyle('-v');
		await SingleStyle('-h');
		await SingleStyle('');
		await SingleStyle('--version');
    });
    test('test override util', async () =>{
		let res:any = await GitStyle('utils3 -vvv');
		expect(res).toHaveProperty('information');
		let object = expect(res.information);
		object.toHaveProperty('name','demoapp');
		object.toHaveProperty('bin');
		object.toHaveProperty('main');
		object.toHaveProperty('version');
	});
});