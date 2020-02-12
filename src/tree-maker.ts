import * as chalk from "chalk";
import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { render } from "./render";
import { ok } from "assert";
//#region Types and interfaces
interface chainable {}
interface Chain {
	fn:any
	args:any[]
}
type operations = chainable;
type chain_return = { d: typeof chainable_dir, dir: typeof chainable_dir, with: (...operations:operations[]) => chain_return, w: (...operations:operations[]) => chain_return };
interface fs_interface {
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
let template = (path:string)=>path;
let project = (path:string)=>path;
//#endregion
export function intercept(_template, _target?:any) {
	if(_template) template = _template;
	if(_target)project = _target;
}
function _copy(source:string, target?:string) {
	return {fn:copy, args:[source, target]} as chainable;
}
function _cmp(source:string, data:{[p:string]:string}, target:string=source) {
	return {fn:compile, args:[source, data, target]} as chainable;
}
function _dir(folder:string, ...operations:chainable[] ) {
	return {
		fn:mkdirtreeandchild,
		args:[folder, ...operations]
	} as chainable;
}
//#region actual functions

function mkdir (this:fs_interface, dir:string='') {
	dir = this.project(dir)
    try{
    	mkdirSync(dir);
    }catch(e){}
    fFile(dir);
}
/**
 * Copies a file from the cli root to the target application folder
 */
function copy (this:fs_interface, source:string, target:string=source) {
	source = template(this.template(source));
	target = project(this.project(target));
	copyFileSync(source, target);
	fFile(target);
}

function compile(this:fs_interface, source:string, data:{[p:string]:string}, target:string=source) {
	source = template(this.template(source))
	target = project(this.project(target));
	render(source, data, target);
	fFile(target);
}
//#endregion
function mkdirtreeandchild(folder, ...operations:chainable[]) {
	mkdir.bind(this)(folder);
	let root = this.root;
	for(const rtnOBJ of operations as Chain[]) {
		let fsInterface:fs_interface = {
			root,
			template: (...args)=> this.template(folder, ...args),
			project: (...args)=> this.project(folder, ...args)
		}
		rtnOBJ.fn.bind(fsInterface)(...rtnOBJ.args);
	}

}
function chainable_dir(folder:string, ...operations:chainable[] ) {
	let spath = this.path;
	this.path = join(this.path, folder);
	let {path, root} = this;
	if(folder) {
		mkdir.bind({project:(...args)=>join(...args)})(path);
		// fFile(path);
	}
	for(const rtnOBJ of operations as Chain[]) {
		let fsInterface:fs_interface = {
			root,
			template: (...args)=> join(path.replace(root,''), ...args),
			project: (...args)=> join(path, ...args)
		}
		rtnOBJ.fn.bind(fsInterface)(...rtnOBJ.args);
	}
	return {
		d:chainable_dir.bind({path:spath,root}),
		dir:chainable_dir.bind({path:spath,root}),
		with:chainable_dir.bind({path:spath,root}, ''),
		w:chainable_dir.bind({path:spath,root}, ''),
	} as chain_return;
}
function _root(root:string){
	this.path = join(this.path, root);
	let path = this.path;
	if(root) {
		mkdir.bind({project:(...args)=>join(...args)})(path);
	}
	return {
		d:chainable_dir.bind({path, root}),
		dir:chainable_dir.bind({path, root}),
		with:chainable_dir.bind({path, root}, ''),
		w:chainable_dir.bind({path, root}, '')
	} as chain_return;
}
/**
 * Initiates a filesystem building tree
 */
export const root = _root.bind({path:''}) as typeof _root;
/**
 * create a directory that can contain multiple actions
 */
export const dir = _dir.bind({fn:chainable_dir}) as typeof _dir;
/**
 * Copies a file from the cli root to the target application folder
 */
export const cpy = _copy.bind({fn:copy}) as typeof _copy;
export const cmp = _cmp.bind({fn:compile}) as typeof _cmp;

export { cpy as c, cmp as z, dir as d, root as r};
