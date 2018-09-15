import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '../../src/options';
import { ok, error, warn, info, ask, input } from '../../src/console';
import { capitalize, created, updated } from '../../src/utils';
import { targetPath, cliPath } from '../../src/paths';
import { spin } from '../../src/spinner';
import * as assert from 'assert';
export let description = 'A description for your command';
export let args = '<arg1>';
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
export async function action(arg1:string, arg2:string, opt:Parsed<typeof options>) {
	return {
        arg1,
        arg2,
		opt
	};
}