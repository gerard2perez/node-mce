import { TreeMaker } from "./wrappers";
import { join } from "path";
import { mkdir, compile, copy, write } from "./fs";
import { chainable_dir, _cmp, _dir, _copy, _write, chainable } from './wrappers';

function _root(root:string){
	this.path = join(this.path, root);
	let path = this.path;
	mkdir.bind({project:(...args)=>join(...args)})(path);
	return {
		d:chainable_dir.bind({path, root}),
		dir:chainable_dir.bind({path, root}),
		with:chainable_dir.bind({path, root}, ''),
		w:chainable_dir.bind({path, root}, '')
	} as TreeMaker;
}
/**
 * Initiates a filesystem building tree
 */
export const root = ((folder:string)=> _root.bind({path:''})(folder)) as typeof _root;
/**
 * create a directory that can contain multiple actions
 */
export const dir = _dir.bind({fn:chainable_dir}) as typeof _dir;
/**
 * Copies a file from the cli root to the target application folder
 */
export const cpy = _copy.bind({fn:copy}) as typeof _copy;
export const wrt = _write.bind({fn:write}) as typeof _write;
export const cmp = _cmp.bind({fn:compile}) as typeof _cmp;

export { cpy as c, cmp as z, dir as d, root as r, wrt as w};
export function match(condition:boolean, fn:chainable):chainable {
	return condition ? fn:undefined;
}
// export { compile, copy, intercept, mkdir, write, template, project } from './fs';
export { TreeMaker } from "./wrappers";