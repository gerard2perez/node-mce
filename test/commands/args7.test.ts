import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '../../src';
import { ok, error, warn, info, ask, input } from '../../src/console';
import { created, updated } from '../../src/utils';
import { targetPath, cliPath } from '../../src/paths';
import { spin } from '../../src/spinner';
import * as assert from 'assert';
export let description = 'A description for your command';
export let options = {
    number: numeric('-n', 'A number', 10),
    number2: numeric('-n', 'A number2', 2)
};
export async function action(opt:Parsed<typeof options>) {
	return opt;
}