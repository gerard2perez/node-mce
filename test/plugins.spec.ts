process.env.TEST = 'test';
import { existsSync, readdirSync, readFileSync } from '../src/fs';
import { loader, reset, restore, subCommandWithModule } from "./loader";

describe('Self Test #2', ()=>{
	beforeAll(()=>loader('./test'));
	beforeEach(()=>reset());
	afterAll(()=>restore());
	test('loads submodules', async()=>{
		expect(true);
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
		await subCommandWithModule('test-commands', 'module:submodule');
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
		// await subCommandWithModule('test.json', 'submodule');
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(false);
		// await subCommandWithModule('test.json', 'submodule');
	});
});