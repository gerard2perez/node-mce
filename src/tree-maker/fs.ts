import chalk from "chalk";
import { basename, dirname, posix, resolve } from "path";
import { copyFileSync, mkdirSync, writeFileSync } from "../fs";
import { ok } from "../verbose";
import { render } from "./render";
export interface fs_interface {
	path: string
	root:string
	template:(...path:string[])=>string,
	project:(...path:string[])=>string
}
// export function highLightBasename2(text:TemplateStringsArray, ...values:any[]) {
// 	console.log(text, values);
// }
export function highLightBasename(path:string, highlight:string):string;
export function highLightBasename(text:TemplateStringsArray, ...values:any[]):string;
export function highLightBasename(...data:any[]) {
	let result = '';
	if(data.length === 2 && typeof(data[0]) === 'string' && typeof(data[1]) === 'string' ) {
		const [path, highlight] = data as [string, string];
		result = chalk`${dirname(path)}/{${highlight} ${basename(path)}}`.replace(/\\/gm, posix.sep).replace(/^\.[\\\/]/, '');
	} else {
		const [stringarray, ...[directory]] = data as [TemplateStringsArray, ...string[]];
		const dname = dirname(directory);
		const bsname = basename(directory);
		result = `${dname}/${chalk(stringarray, bsname)}`.replace(/\\/gm, posix.sep).replace(/^\.[\\\/]/, '');
	}
	return result;
}
function printHighLigthed(target:string) {
	ok(highLightBasename(target, 'green.bold'));
}
let TEMPLATE = (folder:string)=>{
	let res = cliPath('templates', folder)
	return res;
};
let PROJECT = (folder:string)=>folder;
export let template = (path:string)=>path;
export let project = (path:string)=>path;
export function cliPath (...path:string[]) {
    return resolve(process.env.MCE_ROOT, ...path).replace( /* istanbul ignore next */ process.env.TEST === 'test' ? 'src/' : '', '');
}
export function callerPath (...path:string[]) {
    return resolve(process.cwd(), ...path);
}
//#endregion
export function pathResolver(_template:typeof template, _target?:typeof project) {
	TEMPLATE = _template;
	//istanbul ignore else
	if(_target)PROJECT = _target;
}
export function write(target:string, content:string) {
	target = PROJECT(this.project(target));
	writeFileSync(target, content);
	printHighLigthed(target);
}
export function mkdir (dir:string) {
	dir = this.project(dir)
    try{
    	mkdirSync(dir);
	}catch(e){}
	ok(highLightBasename`${dir}`);
}
/**
 * Copies a file from the cli root to the target application folder
 */
export function copy (source:string, target:string=source) {
	let _source = TEMPLATE(this.template(source));
	let _target = PROJECT(this.project(target));
	copyFileSync(_source, _target);
	printHighLigthed(_target);
}
export function writeJSON(file: string, content: any) {
	const target = PROJECT(this.project(file))
	writeFileSync(target, JSON.stringify(content, null, 2)+'\n')
	printHighLigthed(target)
}

export function compile(source:string, data:{[p:string]:string}, target:string=source) {
	source = TEMPLATE(this.template(source));
	target = PROJECT(this.project(target));
	render(source, data, target);
	printHighLigthed(target);
}

export { remove } from './remove';
