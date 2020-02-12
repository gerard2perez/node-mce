import { mkdirSync } from 'fs';
import { input, updateTextSpin } from '../../src/console';
import { override } from '../../src/override';
import { cliPath, targetPath } from '../../src/paths';
import { spin, wait } from '../../src/spinner';
export async function action() {
    let res = await spin('test', async () =>{
        
        wait(1).then(_=>process.stdin.push('10\n', 'utf-8'));
        await input('give me a value');
        let testDir = cliPath('removible');
        try { mkdirSync(testDir); } catch(ex) {}
        await override('get something', testDir, true);
        try { mkdirSync(testDir); } catch(ex) {}
        wait(1).then(_=>process.stdin.push('n\n', 'utf-8'));
        await override('get something', testDir, false);
        try { mkdirSync(testDir); } catch(ex) {}
        wait().then(_=>process.stdin.push('y\n', 'utf-8'));
		updateTextSpin('almost gone');
        return override('get something', testDir, false).then(r=>r.toString());
    });
    
	return {
        cli: cliPath(),
        target: targetPath(),
        res
	};
}