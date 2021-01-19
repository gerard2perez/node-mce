process.env.TEST = 'test';
import { existsSync, readdirSync, readFileSync } from '../src/fs';
import { SetProjectPath, Reset, Restore, WithPlugins } from "./loader";

describe('Self Test #2', ()=>{
	beforeAll(()=>SetProjectPath('./test'));
	beforeEach(()=>Reset());
	afterAll(()=>Restore());
	test('loads submodules', async()=>{
		expect(true);
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
		await WithPlugins('test-commands', 'module:submodule');
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
		// await WithPlugins('test.json', 'submodule');
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(false);
		// await WithPlugins('test.json', 'submodule');
	});
});