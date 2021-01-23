/* eslint-disable @typescript-eslint/no-empty-function */
import chalk from 'chalk'
import { MainSpinner } from './spinner'
import { LogSymbols } from './spinner/symbols'
/**
 * @deprecated Use of this function is not recommended please use the new Tagged template system
 * and import from the root of the package
 * 
 * Indicates the level of verbosity required in order to display
 * @param lvl 
 */
export function log(lvl: number) {
	if( parseInt(process.env.MCE_VERBOSE) >= lvl) {
		return internal_log
	}
	return () => {}
}
function prerender(text: TemplateStringsArray, ...values: any[]) {
	let updated = []
	const [all, transform] = /\{([aA-zZ.]+)\}/.exec(text[0]) || []
	if(transform) {
		updated.push(text[0].replace(all, ''))
		updated.push(...text.slice(1))
	} else {
		updated = [...text.raw] as any
	}
	(updated as any).raw = updated
	return [transform, chalk(updated, ...values)]
}
function internal_log(text: string): void
function internal_log(text: TemplateStringsArray, ...values: any[]): void
function internal_log(text: TemplateStringsArray|string, ...values: any[]) {
	if(typeof text === 'object' && text.raw && text.raw instanceof Array) {
		const [_transform, req] = prerender(text, ...values)
		MainSpinner.log`${req}\n`
	} else {
		MainSpinner.log`${text}\n`
	}
}
function addSymbol(lvl: number, symbol: LogSymbols, color: string) {
	if( parseInt(process.env.MCE_VERBOSE) >= lvl) {
		return (text: TemplateStringsArray|string, ...values: any[]) => {
			if(typeof text === 'object' && text.raw && text.raw instanceof Array) {
				const [transform, req] = prerender(text, ...values)
				MainSpinner.log`{${transform||color} ${symbol}} ${req}\n`
			} else {
				MainSpinner.log`{${color} ${symbol}} ${text}\n`
			}
		}
	} else {
		return () => {}
	}
}
/**
 * @deprecated Use of this function is not recommended please use the new Tagged template system
 * and import from the root of the package
 * 
 * Level 2 verbosity function
 */
export function info(text: string): void
export function info(text: TemplateStringsArray, ...values: any[]): void
export function info(text: TemplateStringsArray|string, ...values: any[]) {
	addSymbol(2, LogSymbols.info, 'blue')(text, ...values)
}
/**
 * @deprecated Use of this function is not recommended please use the new Tagged template system
 * and import from the root of the package
 * 
 * Level 1 verbosity function
 */
export function warn(text: string): void
export function warn(text: TemplateStringsArray, ...values: any[]): void
export function warn(text: TemplateStringsArray|string, ...values: any[]) {
	addSymbol(1, LogSymbols.warning, 'yellow')(text, ...values)
}
/**
 * @deprecated Use of this function is not recommended please use the new Tagged template system
 * and import from the root of the package
 * 
 * Level 0 verbosity function
 */
export function error(text: string): void
export function error(text: TemplateStringsArray, ...values: any[]): void
export function error(text: TemplateStringsArray|string, ...values: any[]) {
	addSymbol(0, LogSymbols.error, 'red')(text, ...values)
}
/**
 * @deprecated Use of this function is not recommended please use the new Tagged template system
 * and import from the root of the package
 * 
 * Level 0 verbosity function
 */
export function ok(text: string): void
export function ok(text: TemplateStringsArray, ...values: any[]): void
export function ok(text: TemplateStringsArray|string, ...values: any[]) {
	addSymbol(0, LogSymbols.success, 'green')(text, ...values)
}
/**
 * @deprecated Use of this function is not recommended please use the new Tagged template system
 * and import from the root of the package
 * 
 * Level 0 verbosity function
 */
export function updated(text: string): void
export function updated(text: TemplateStringsArray, ...values: any[]): void
export function updated(text: TemplateStringsArray|string, ...values: any[]) {
	addSymbol(0, LogSymbols.updated, 'blueBright')(text, ...values)
}
/**
 * @deprecated Use of this function is not recommended please use the new Tagged template system
 * and import from the root of the package
 * 
 * Level 0 verbosity function
 */
export function created(text: string): void
export function created(text: TemplateStringsArray, ...values: any[]): void
export function created(text: TemplateStringsArray|string, ...values: any[]) {
	addSymbol(0, LogSymbols.success, 'green')(text, ...values)
}