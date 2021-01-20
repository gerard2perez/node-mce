process.env.TEST = 'test';
import { existsSync, readdirSync, readFileSync } from '../src/fs';
import { SetProjectPath, Reset, Restore, WithPlugins } from "./loader";
import { readLog } from './log-reader';

describe('Self Test #2', ()=>{
	beforeAll(()=>SetProjectPath('./test'));
	beforeEach(()=>Reset());
	afterAll(()=>Restore());
	test('Can load local commands using the plugin namespace', async()=>{
		expect(true);
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
		await expect(WithPlugins('test-commands', 'l:args -h'))
			.resolves
			.toBe(readLog('local-args.help.log'))
		// await expect(GitStyle('args8 -h')).resolves.toBe(readLog('args8.help.log'))
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
		// await WithPlugins('test.json', 'submodule');
		// //@ts-ignore
		// existsSync.mockReturnValueOnce(false);
		// await WithPlugins('test.json', 'submodule');
	});
});