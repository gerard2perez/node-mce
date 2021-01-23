import chalk from 'chalk'
import { basename, dirname, posix, resolve } from 'path'
import { ok } from '../console'
import { copyFileSync, mkdirSync, writeFileSync } from '../mockable/fs'
import { render } from './render'
export interface fs_interface {
	path: string
	root: string
	template: (...path: string[]) => string,
	project: (...path: string[]) => string
}
/**
 * @deprecated use new Tagged template system for log function
 * @example```
	import { log } from 'gerard2p/mce'
	log(0)`path/to.file|highlightBasename`
	```
 * @param path
 * @param highlight
 */
export function highLightBasename(path: string, highlight: string): string
export function highLightBasename(text: TemplateStringsArray, ...values: any[]): string
/* istanbul ignore next */
export function highLightBasename(...data: any[]) {
	let result = ''
	if(data.length === 2 && typeof data[0] === 'string' && typeof data[1] === 'string' ) {
		const [path, highlight] = data as [string, string]
		result = chalk`${dirname(path)}/{${highlight} ${basename(path)}}`.replace(/\\/gm, posix.sep).replace(/^\.[\\/]/, '')
	} else {
		const [stringarray, ...[directory]] = data as [TemplateStringsArray, ...string[]]
		const dname = dirname(directory)
		const bsname = basename(directory)
		result = `${dname}/${chalk(stringarray, bsname)}`.replace(/\\/gm, posix.sep).replace(/^\.[\\/]/, '')
	}
	return result
}
function printHighLigthed(target: string) {
	ok`{${target}|highlightBasename:green}`
}
let TEMPLATE = (folder: string) => {
	const res = cliPath('templates', folder)
	return res
}
let PROJECT = (folder: string) => folder
export const template = (path: string) => path
export const project = (path: string) => path
export function cliPath (...path: string[]) {
    return resolve(process.env.MCE_ROOT, ...path).replace( /* istanbul ignore next */ process.env.TEST === 'test' ? 'src/' : '', '')
}
export function callerPath (...path: string[]) {
    return resolve(process.cwd(), ...path)
}
//#endregion
export function pathResolver(_template: typeof template, _target?: typeof project) {
	TEMPLATE = _template
	//istanbul ignore else
	if(_target)PROJECT = _target
}
export function write(target: string, content: string) {
	target = PROJECT(this.project(target))
	writeFileSync(target, content)
	ok`{${target}|highlightBasename:green}`
}
export function mkdir (dir: string) {
	dir = this.project(dir)
    try {
		mkdirSync(dir)
	} catch(_error) { 
		// istanbul ignore next
		_error.message = null
	} finally {
		ok`{${dir}|highlightBasename}`
	}
	
}
/**
 * Copies a file from the cli root to the target application folder
 */
export function copy (source: string, target: string=source) {
	const _source = TEMPLATE(this.template(source))
	const _target = PROJECT(this.project(target))
	copyFileSync(_source, _target)
	printHighLigthed(_target)
}
export function writeJSON(file: string, content: any) {
	const target = PROJECT(this.project(file))
	writeFileSync(target, JSON.stringify(content, null, 2)+'\n')
	printHighLigthed(target)
}

export function compile(source: string, data: {[p: string]: string}, target: string=source) {
	source = TEMPLATE(this.template(source))
	target = PROJECT(this.project(target))
	render(source, data, target)
	printHighLigthed(target)
}

export { remove } from './remove'

