import chalk from 'chalk'
import { basename, dirname, posix } from 'path'
import { RegisterLogFormater } from './register-log-formater'
export function highlightBasename(path: string, primary = 'green', secondary = 'white') {
    const directory = chalk[secondary](dirname(path).replace(/\\/gm, posix.sep)+'/').replace('./', '')
	const file = chalk.bold(chalk[primary](basename(path)))
	return `${directory}${file}`
}
RegisterLogFormater(highlightBasename, 'highlightBasename')