import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '../../src/options';
import { ok, error, warn, info, ask, input, pause, resume } from '../../src/console';
import { capitalize, created, updated } from '../../src/utils';
import { targetPath, cliPath } from '../../src/paths';
import { spin } from '../../src/spinner';
import * as assert from 'assert';
import { override } from '../../src/override';
import { mkdirSync } from 'fs';
export let description = 'A description for your command';
export let args = '';
export let options = {
    enumeration: enumeration('-e <enum>', 'Define the style of command you will use', ['git', 'single']),
    number: numeric('-n <n>', 'A number'),
    floating: floating('-f <n>', 'A float number'),
    range: range('-r <a>..<b>', 'A Range of two numbers'),
    text: text('-t <n>', 'A string value'),
    list: list('-l <n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    bool: bool('-b', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
};

export async function action(opt:Parsed<typeof options>) {
    let res = await spin('test', async () =>{
        pause();
        ok('');
        error('');
        warn('');
        info('');
        resume();
        let testDir = cliPath('removible');
        try { mkdirSync(testDir); } catch(ex) {}
        await override('get somethind', testDir, true);
        setTimeout(()=>{
            process.stdin.push('n\n', 'utf-8');
        },1);
        await override('get somethind', testDir, false);
        setTimeout(()=>{
            process.stdin.push('y\n', 'utf-8');
        },1);
        return override('get somethind', testDir, false).then(r=>r.toString());
    });
    
	return {
        cli: cliPath(),
        target: targetPath(),
        res
	};
}