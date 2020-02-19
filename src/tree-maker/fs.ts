import * as chalk from "chalk";
import { basename, dirname, posix, resolve } from "path";
import { copyFileSync, mkdirSync, writeFileSync } from "../fs";
import { ok } from "../verbose";
import { render } from "./render";
export interface fs_interface {
	root:string
	template:(...path:string[])=>string,
	project:(...path:string[])=>string
}
export function highLightBasename(path:string, highlight:string) {
	return chalk`${dirname(path)}/{${highlight} ${basename(path)}}`.replace(/\\/gm, posix.sep).replace(/^\.[\\\/]/, '');
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
    return resolve(process.env.MCE_ROOT, ...path);
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
    printHighLigthed(dir);
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

export function compile(source:string, data:{[p:string]:string}, target:string=source) {
	source = TEMPLATE(this.template(source))
	target = PROJECT(this.project(target));
	render(source, data, target);
	printHighLigthed(target);
}

export { remove } from './remove';
