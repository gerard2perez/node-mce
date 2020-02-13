import * as chalk from "chalk";
import { copyFileSync, mkdirSync, writeFileSync} from "../fs";
import { join, resolve } from "path";
import { render } from "./render";
import { ok } from "../verbose";
export interface fs_interface {
	root:string
	template:(...path:string[])=>string,
	project:(...path:string[])=>string
}
function fFile(target:string) {
    let path = target.split(/\\|\//gm);
	// path.splice(0,0,RelPathRoot);
	let last:string = path.pop();
	ok(join(...path, chalk.green(last)).replace(/\\/mg, '/'));
}
let TEMPLATE = (folder:string)=>callerPath('templates', folder);
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
	fFile(target);
}
export function mkdir (dir:string) {
	dir = this.project(dir)
    try{
    	mkdirSync(dir);
	}catch(e){}
    fFile(dir);
}
/**
 * Copies a file from the cli root to the target application folder
 */
export function copy (source:string, target:string=source) {
	let _source = TEMPLATE(this.template(source));
	let _target = PROJECT(this.project(target));
	copyFileSync(_source, _target);
	fFile(_target);
}

export function compile(source:string, data:{[p:string]:string}, target:string=source) {
	source = TEMPLATE(this.template(source))
	target = PROJECT(this.project(target));
	render(source, data, target);
	fFile(target);
}

export {remove} from './remove';