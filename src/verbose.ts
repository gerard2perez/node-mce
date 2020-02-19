import { MainSpinner } from "./spinner";
import { LogSymbols } from "./spinner/symbols";
import chalk = require("chalk");
/**
 * Indicates the level of verbosity required in order to display
 * @param lvl 
 */
export function log(lvl:number) {
	if( parseInt(process.env.MCE_VERBOSE) >= lvl) {
		return MainSpinner.log.bind(MainSpinner);
	}
	return ()=>{}
}
function prerender(text:TemplateStringsArray, ...values:any[]) {
	let updated = []
	const [all, transform] = /\{([aA-zZ\.]+)\}/.exec(text[0]) || [];
	if(transform) {
		updated.push(text[0].replace(all, ''));
		updated.push(...text.slice(1));
	} else {
		updated = [...text.raw] as any;
	}
	//@ts-ignore
	updated.raw = updated;
	return [transform, chalk(updated, ...values)];
}
function addSymbol(lvl:number, symbol:LogSymbols, deftransform:string) {
	if( parseInt(process.env.MCE_VERBOSE) >= lvl) {
		return (text:TemplateStringsArray|string, ...values:any[]) => {
			if(typeof text === 'object' && text.raw && text.raw instanceof Array) {
				let [transform, req] = prerender(text, ...values);
				MainSpinner.log`{${transform||deftransform} ${symbol}} ${req}`;
			} else {
				MainSpinner.log`{${deftransform} ${symbol}} ${text}`;
			}
		};
	} else {
		return ()=>{}
	}
}
/**
 * Level 2 verbosity function
 */
export function info(text:string):void;
export function info(text:TemplateStringsArray, ...values:any[]):void;
export function info(text:TemplateStringsArray|string, ...values:any[]) {
	addSymbol(2, LogSymbols.info, 'blue')(text, ...values);
}
/**
 * Level 1 verbosity function
 */
export function warn(text:string):void;
export function warn(text:TemplateStringsArray, ...values:any[]):void;
export function warn(text:TemplateStringsArray|string, ...values:any[]) {
	addSymbol(1, LogSymbols.warning, 'yellow')(text, ...values);
}
/**
 * Level 0 verbosity function
 */
export function error(text:string):void;
export function error(text:TemplateStringsArray, ...values:any[]):void;
export function error(text:TemplateStringsArray|string, ...values:any[]) {
	addSymbol(0, LogSymbols.error, 'red')(text, ...values);
}
/**
 * Level 0 verbosity function
 */
export function ok(text:string):void;
export function ok(text:TemplateStringsArray, ...values:any[]):void;
export function ok(text:TemplateStringsArray|string, ...values:any[]) {
	addSymbol(0, LogSymbols.success, 'green')(text, ...values);
}
/**
 * Level 0 verbosity function
 */
export function updated(text:string):void;
export function updated(text:TemplateStringsArray, ...values:any[]):void;
export function updated(text:TemplateStringsArray|string, ...values:any[]) {
	addSymbol(0, LogSymbols.updated, 'blueBright')(text, ...values);
}
/**
 * Level 0 verbosity function
 */
export function created(text:string):void;
export function created(text:TemplateStringsArray, ...values:any[]):void;
export function created(text:TemplateStringsArray|string, ...values:any[]) {
	addSymbol(0, LogSymbols.success, 'green')(text, ...values);
}