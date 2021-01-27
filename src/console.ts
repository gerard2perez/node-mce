/* eslint-disable @typescript-eslint/no-empty-function */
import chalk from 'chalk'
import { MainSpinner } from './spinner'
import { LogSymbols } from './spinner/symbols'
type FormatterFn = (text: string, ...args: any[]) => string
const Formatters = new Map<string, FormatterFn>()
export function RegisterLogFormatter(fn: FormatterFn, name?: string) {
	Formatters.set(name || fn.name, fn)
}
const chalkFns = [
    ...['rest', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'visible'],
    ...['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'],
    ...['blackBright', 'grey', 'gray', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright', 'whiteBright'],
    ...['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite', 'bgBlackBright',
    'bgGray',
    'bgGrey',
    'bgRedBright',
    'bgGreenBright',
    'bgYellowBright',
    'bgBlueBright',
    'bgMagentaBright',
    'bgCyanBright',
    'bgWhiteBright']
]
for( const id of chalkFns) {
    const fn = function(text: string) {
        return chalk[id](text)
    }
    RegisterLogFormatter(fn, id)
}
function rgb(text: string, r, g, b) {
    return chalk.rgb(r, g, b)(text)
}
function sy(symbol: string) {
    return LogSymbols[symbol]
}
RegisterLogFormatter(rgb)
RegisterLogFormatter(sy)

function tagcompiler(text: TemplateStringsArray, ...values: any[]) {
    let complete = text.reduce((message, part, index) => {
        return `${message}${part}${values[index]||''}`
    }, '')
    const exp = /\{([^}]*)\}/mg
    let result: RegExpExecArray
    // eslint-disable-next-line no-cond-assign
    while (result = exp.exec(complete)) {
        const [full, fnWithPipes] = result
        let [value, ...pipesWithArgs] = fnWithPipes.split('|')
        for(const pipeWithArgs of pipesWithArgs) {
            const [pipeName, ...args] = pipeWithArgs.trim().split(':')
			const pipe = Formatters.get(pipeName)
			// istanbul ignore else
            if(pipe) {
                value = pipe(value, ...args) /* istanbul ignore next */ || ''
            }
        }
        complete = complete.replace(full, value)
        exp.lastIndex = result.index + value.length
    }
    return complete
}
export function log(lvl: number, newLine?: boolean) {
	newLine = newLine !== false
	if( parseInt(process.env.MCE_VERBOSE) >= lvl) {
		return (text: TemplateStringsArray, ...values: any[]) => {
			MainSpinner.log`${tagcompiler(text, ...values)}${newLine?'\n':''}`
		}
			
	}
	return () => {}
}
export function info(text: TemplateStringsArray, ...values: any[]) {
	log(2)`{info|sy|cyan} ${tagcompiler(text, ...values)}`
}
export function warn(text: TemplateStringsArray, ...values: any[]) {
	log(1)`{warning|sy|yellow} ${tagcompiler(text, ...values)}`
}
export function error(text: TemplateStringsArray, ...values: any[]) {
	log(0)`{error|sy|red} ${tagcompiler(text, ...values)}`
}
export function ok(text: TemplateStringsArray, ...values: any[]) {
	log(0)`{success|sy|green} ${tagcompiler(text, ...values)}`
}
export function updated(text: TemplateStringsArray, ...values: any[]) {
	log(0)`{updated|sy|blueBright} ${tagcompiler(text, ...values)}`
}
export function created(text: TemplateStringsArray, ...values: any[]) {
	log(0)`{success|sy|blueBright} ${tagcompiler(text, ...values)}`
}