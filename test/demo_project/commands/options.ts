import { bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from '../../../src'
import { makeChainable } from '../../../src/tree-maker'
export const description = 'A description for your command'
export const args = '<arg1> [varidac...]'
export const options = {
    enumeration: enumeration('-e <enum>', 'Define the style of command you will use', ['git', 'single']),
    number: numeric('-n <n>', 'A number'),
    floating: floating('-f <n>', 'A float number'),
    range: range('-r <a>..<b>', 'A Range of two numbers'),
	text: text('-t --text <n>', 'A string value'),
	text_def: text('-d --text <n>', 'A string value', 'def'),
    list: list('-l <n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    bool: bool('-b', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
}
export async function action(arg1: string, varidac: string[], opt: Parsed<typeof options>) {
	const chain = expect(makeChainable( (a, b) => 1)(1, 2))
	chain.toHaveProperty('fn')
	chain.toHaveProperty('args')
	return {
		arg1,
		varidac,
		opt
	}
}