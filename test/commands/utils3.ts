import { mkdirSync } from 'fs';
import { updateTextSpin } from '../../src/spinner/console';
import { cliPath, callerPath } from '../../src/tree-maker/fs';
import { spin, wait } from '../../src/spinner';
import { question, override } from '../../src/input';
import {information} from '../../src';
export async function action() {
    // let res = await spin('test', async () =>{
        
    //     wait(1).then(_=>process.stdin.push('10\n', 'utf-8'));
    //     await question('give me a value');
    //     let testDir = cliPath('removible');
    //     try { mkdirSync(testDir); } catch(ex) {}
    //     await override('get something', testDir, true);
    //     try { mkdirSync(testDir); } catch(ex) {}
    //     wait(1).then(_=>process.stdin.push('n\n', 'utf-8'));
    //     await override('get something', testDir, false);
    //     try { mkdirSync(testDir); } catch(ex) {}
    //     wait().then(_=>process.stdin.push('y\n', 'utf-8'));
	// 	updateTextSpin('almost gone');
    //     return override('get something', testDir, false).then(r=>r.toString());
    // });
    
	return {
        // cli: cliPath(),
        // target: callerPath(),
		// res,
		information: information()
	};
}