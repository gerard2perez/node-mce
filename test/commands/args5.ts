import { bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from '../../src';
export let description = 'A description for your command';
export let args = '<arg2:bool> [arg2...] <arg1:number>';
export let options = {
    enumeration: enumeration('-e <enum>', 'Define the style of command you will use', ['git', 'single']),
    number: numeric('-n <n>', 'A number', 10),
    floating: floating('-f <n>', 'A float number', 12.3),
    range: range('-r <a>..<b>', 'A Ra nge of two numbers'),
    text: text('-t <n>', 'A string value'),
    list: list('-l <n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    bool: bool('-b', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
};
export async function action(arg1:number, arg2:boolean, opt:Parsed<typeof options>) {
	return {
        arg1,
        arg2,
		opt
	};
}