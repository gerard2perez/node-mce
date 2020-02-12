/**
 * @module @gerard2p/mce/utils
 */
import * as chalk from "chalk";
import { copyFileSync, existsSync, mkdirSync } from "./fs";
import { join } from "path";
import { ok } from "./console";
import { targetPath } from "./paths";
function print (mode:string, text:string) {
    let fpath = text.replace(targetPath(), '').replace(/\\/gm, '/').split('/');
    ok(`\t${chalk.cyan(mode)}: ${printRelativePath(...fpath)}`);
}
export function getRelativePath(location:string[], relativeTo:string = targetPath()) {
	return location.join('/')
		.replace(/\\/mg, '/')
		.replace(relativeTo.replace(/\\/mg, '/'), '')
		.replace(/^[\\\/]/, '');
}
export function printRelativePath(...path:string[]) {
	let relative = getRelativePath(path).split('/');
	let last:string = relative.pop();
	if(relative.length === 0) {
		return `${chalk.green(last)}`;
	} else {
		let root = chalk.grey(join(...relative).replace(/\\/mg, '/'));
		return `${root}/${chalk.green(last)}`;
	}
    
}
export const created:(text:string)=>void = (text)=>print('created', text);
export const updated:(text:string)=>void = (text)=>print('updated', text);
/** @ignore */
export function iter<T=any>(obj: any) {
	obj[Symbol.iterator] = function () {
		let keys = Object.keys(this);
		let data:{[p:string]:T} = this;
		let total = keys.length;
		return { i: 0,
			next() {
				let current = this.i;
				let key = keys[current];
				return {
					value: [
						key,
						data[key],
						current,
						total
					],
					done: this.i++ === total
				};
			}
		};
	}
    return obj as {
		[Symbol.iterator]():{
			next(): IteratorResult<[string, T, number, number]>
		}
	 };
}
export function makeDir(location:string) {
	if(!existsSync(location)) {
		mkdirSync(location);
		ok(printRelativePath(location));
	}
}
export function cp(source:string, target:string, print:boolean = true) {
	copyFileSync(source, target);
	if(print) {
		ok(printRelativePath(target));
	}
}
export { override } from './override';
export * from './paths';
export { remove } from './remove';
export { render } from './render';
export { rawSpawn, spawn, spinSpawn } from './spawn';
