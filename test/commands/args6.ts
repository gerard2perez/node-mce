import { bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from '../../src';
export let description = 'A description for your command';
export let options = {
    collect: collect('', 'A repetable value'),
    enumeration: enumeration('-e', 'Define the style of command you will use', ['git', 'single']),
    number: numeric('-n [n]', 'A number', 10),
    age: numeric('', 'A number', 10),
    floating: floating('-f', 'A float number', 12.3),
    range: range('-r', 'A Ra nge of two numbers'),
    text: text('-t', 'A string value',/^[a-z]{2}$/),
    list: list('-l', 'comma separed values'),
    bool: bool('-b', 'A boolean value'),
    deep: bool('--deep', 'A boolean value'),
    w: bool('', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
};
export async function action(opt:Parsed<typeof options>) {
	return opt;
}