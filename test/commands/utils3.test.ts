import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '../../src/options';
import { ok, error, warn, info, ask, input, pause, resume } from '../../src/console';
import { capitalize, created, updated } from '../../src/utils';
import { targetPath, cliPath } from '../../src/paths';
import { spin, wait } from '../../src/spinner';
import * as assert from 'assert';
import { override } from '../../src/override';
import { mkdirSync } from 'fs';
export async function action(opt:any) {
    let res = await spin('test', async () =>{
        
        let testDir = cliPath('removible');
        try { mkdirSync(testDir); } catch(ex) {}
        await override('get something', testDir, true);
        try { mkdirSync(testDir); } catch(ex) {}
        wait(1).then(o=>process.stdin.push('n\n', 'utf-8'));
        await override('get something', testDir, false);
        try { mkdirSync(testDir); } catch(ex) {}
        wait().then(o=>process.stdin.push('y\n', 'utf-8'));
        return override('get something', testDir, false).then(r=>r.toString());
    });
    
	return {
        cli: cliPath(),
        target: targetPath(),
        res
	};
}