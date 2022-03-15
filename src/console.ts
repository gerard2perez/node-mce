/* eslint-disable @typescript-eslint/no-empty-function */
import chalk from 'chalk'
import { MainSpinner } from './spinner'
import { LogSymbols } from './spinner/symbols'
import { streams } from './system-streams'
type FormatterFn = (text: string, ...args: any[]) => string
const Formatters = new Map<string, FormatterFn>()
export function RegisterLogFormatter(fn: FormatterFn, name?: string) {
	Formatters.set(name || fn.name, fn)
}
const Color = {
	black: 'black', red: 'red', green: 'green', yellow: 'yellow', blue: 'blue', magenta: 'magenta', cyan: 'cyan', white: 'white',
	blackBright: 'blackBright', grey: 'grey', gray: 'gray', redBright: 'redBright', greenBright: 'greenBright', yellowBright: 'yellowBright', blueBright: 'blueBright', magentaBright: 'magentaBright', cyanBright: 'cyanBright', whiteBright: 'whiteBright'
}
const Decoration = {rest: 'rest', bold: 'bold', dim: 'dim', italic: 'italic', underline: 'underline', inverse: 'inverse', hidden: 'hidden', strikethrough: 'strikethrough', visible: 'visible'}
const Background = {
	bgBlack: 'bgBlack', bgRed: 'bgRed', bgGreen: 'bgGreen', bgYellow: 'bgYellow', bgBlue: 'bgBlue', bgMagenta: 'bgMagenta', bgCyan: 'bgCyan', bgWhite: 'bgWhite', bgBlackBright: 'bgBlackBright',
	bgGray: 'bgGray', bgGrey: 'bgGrey', bgRedBright: 'bgRedBright', bgGreenBright: 'bgGreenBright', bgYellowBright: 'bgYellowBright', bgBlueBright: 'bgBlueBright', bgMagentaBright: 'bgMagentaBright', bgCyanBright: 'bgCyanBright', bgWhiteBright: 'bgWhiteBright'
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
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type Color = keyof typeof Color
export type Decoration = keyof typeof Decoration
export type Background = keyof typeof Background

for( const id of chalkFns) {
    const fn = function(text: string) {
        return chalk[id](text)
    }
    RegisterLogFormatter(fn, id)
}
function cleanColor(text: string) {
	// eslint-disable-next-line no-control-regex
	return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}
function rgb(text: string, r, g, b) {
    return chalk.rgb(r, g, b)(text)
}
function sy(symbol: string) {
    return LogSymbols[symbol]
}
RegisterLogFormatter(rgb)
RegisterLogFormatter(sy)
RegisterLogFormatter( (text: string, _spaces = '0', sym = ' ') => {
	const spaces = parseInt(_spaces)
	const colorsLenght = text.length - cleanColor(text).length
    return text.padStart(spaces + colorsLenght, sym)
 }, 'padl')
 RegisterLogFormatter( (text: string,  _spaces = '0', sym = ' ') => {
	const spaces = parseInt(_spaces)
	const colorsLenght = text.length - cleanColor(text).length
    return text.padEnd(spaces + colorsLenght, sym)
  }, 'padr')
 RegisterLogFormatter( (number_like: string) => {
     const formatter = new Intl.NumberFormat('es-MX', {
         style: 'currency',
         currency: 'MXN',
       })
     const float = parseFloat(number_like.toString()) || 0
     return formatter.format(float) + ' MXN'
 }, 'currency')
//  const wordWrap = (size: number) => new RegExp(`(?![^\\n]{1,${size}}$)([^\\n]{1,${size}})\\s|$`, 'g')
const wordWrap = (size: number) => new RegExp(`([^\\n]{1,${size}})(\\s|$)`, 'g')


 RegisterLogFormatter((text = '', start=0) => {
	const [width] = streams.output.getWindowSize()
	const size =  width-start	
	let result = (text||'').match(wordWrap(size)) as string[] || [text]
	result = result.map( (line, i) => {
		line = line.trim()
		const spacesNeeded = size - line.length
		const shoulfFill =  i !== result.length - 1
		const currentSpaces = (line.match(/\w\b/g)||[]).length - 1
		if(shoulfFill && spacesNeeded > 0 && currentSpaces > 0) {
			const insertNSpaces = Math.floor(spacesNeeded / currentSpaces)
			const leftSpaces = spacesNeeded % currentSpaces
			line = line.split(' ')
				.map((word, i) => word + ''.padEnd(insertNSpaces+(i<leftSpaces?1:0), ' '))
				.join(' ').trimEnd()
		}
		return line
	}) as string[]
	return result ? result.map( (l, i) => (i ? ''.padStart(start, ' ') : '') + l).join('\r\n') : text.padStart(start, ' ')
 }, 'autowrap')

function tagcompiler(text: TemplateStringsArray, ...values: any[]) {
    let complete = text.reduce((message, part, index) => {
        return `${message}${part}${values[index]||''}`
    }, '')
    const exp = /\{([^}{]*)\}/gm
    let result: RegExpExecArray
    
	while(complete.includes('{'))
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
export function print(text: TemplateStringsArray, ...values: any[]) {
	streams.output.write(tagcompiler(text, ...values))
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


