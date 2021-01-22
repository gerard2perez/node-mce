import { bool, callerPath, cliPath, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from '../../../src'
export const description = 'A description for your command'
export const args = ''
export const options = {
    enumeration: enumeration('-e <enum>', 'Define the style of command you will use', ['git', 'single']),
    number: numeric('-n <n>', 'A number'),
    floating: floating('-f <n>', 'A float number'),
    range: range('-r <a>..<b>', 'A Range of two numbers'),
    text: text('-t <n>', 'A string value'),
    list: list('-l <n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    bool: bool('-b', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
}
export async function action(_opt: Parsed<typeof options>) {
	return {
        cli: cliPath(),
        target: callerPath()
	}
}