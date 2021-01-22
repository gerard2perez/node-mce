import { bool, collect, enumeration, floating, list, numeric, Parsed, text, verbose } from '../../../src'
import { cliPath } from '../../../src/tree-maker/fs'
import { render } from '../../../src/tree-maker/render'
export const description = 'A description for your command'
export const args = ''
export const options = {
    enumeration: enumeration('-e <enum>', 'Define the style of command you will use', ['git', 'single']),
    number: numeric('-n <n>', 'A number'),
    floating: floating('-f <n>', 'A float number'),
    text: text('-t <n>', 'A string value'),
    list: list('-l <n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    render: bool('-r', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
}

export async function action(opt: Parsed<typeof options>) {
	const path = cliPath('./demo.txt')
	const target = opt.render ? cliPath(path): undefined
    return render(cliPath(path), {demo: 'works'}, target)
}