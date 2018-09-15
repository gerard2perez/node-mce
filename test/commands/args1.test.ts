import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '../../src';
import { ok, error, warn, info, ask, input } from '../../src/console';
import { created, updated } from '../../src/utils';
import { targetPath, cliPath } from '../../src/paths';
import { spin } from '../../src/spinner';
import * as assert from 'assert';
export let description = 'A description for your command';
export let args = '<arg1> [arg2] [varidac...]';
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
export async function action(arg1:string, arg2:string, varidac:string[], opt:Parsed<typeof options>) {
	return {
		arg1,
		varidac,
		opt
	};
}