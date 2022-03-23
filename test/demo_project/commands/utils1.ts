import { verbosity, pause, resume, created, error, info, ok, updated, warn, bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from '@gerard2p/mce'
import { spin } from '@gerard2p/mce/spinner'
import { callerPath, cliPath } from '@gerard2p/mce/fs'
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
    await spin('test', async () => {
        pause()
        ok`{test|red}`
        error`{test|rgb:0:0:0}`
        warn`test`
        info`test`
        resume()
        created`chochis.ts`
		updated`chochis.ts`
		verbosity(3)`test`
		verbosity(3)`test 2`
    })
	return {
        cli: cliPath(),
        target: callerPath()
	}
}