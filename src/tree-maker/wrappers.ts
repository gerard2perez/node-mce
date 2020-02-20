import { join, relative } from "path";
import { compile, copy, fs_interface, mkdir, write } from "./fs";
export type TreeMaker = { d: typeof chainable_dir, dir: typeof chainable_dir, with: (...operations:operations[]) => TreeMaker, w: (...operations:operations[]) => TreeMaker };
type operations = chainable;
interface Chain {
	fn:any
	args:any[]
}
export function mkdirtreeandchild(folder, ...operations:chainable[]) {
	mkdir.bind(this)(folder);
	let root = this.root;
	for(const rtnOBJ of operations.filter(d=>d) as Chain[]) {
		let fsInterface:fs_interface = {
			root,
			template: (...args)=> this.template(folder, ...args),
			project: (...args)=> this.project(folder, ...args)
		}
		rtnOBJ.fn.bind(fsInterface)(...rtnOBJ.args);
	}

}
export interface chainable {}
export function _copy(source:string, target?:string) {
	return {fn:copy, args:[source, target]} as chainable;
}
export function _cmp(source:string, data:{[p:string]:string}, target?:string) {
	return {fn:compile, args:[source, data, target]} as chainable;
}
export function _dir(folder:string, ...operations:chainable[] ) {
	return {
		fn:mkdirtreeandchild,
		args:[folder, ...operations.filter(d=>d)]
	} as chainable;
}
export function _write(target:string, content:string ) {
	return {
		fn:write,
		args:[target, content]
	} as chainable;
}
export function chainable_dir(folder:string, ...operations:chainable[] ) {
	let spath = this.path;
	this.path = join(this.path, folder);
	let {path, root} = this;
	if(folder) {
		mkdir.bind({project:(...args)=>join(...args)})(path);
	}
	for(const rtnOBJ of operations.filter(d=>d) as Chain[]) {
		let fsInterface:fs_interface = {
			root,
			template: (...args)=> join(relative(root,path), ...args),
			project: (...args)=> join(path, ...args)
		}
		rtnOBJ.fn.bind(fsInterface)(...rtnOBJ.args);
	}
	return makeChainableDir(spath, root);
}

export function makeChainableDir(path:string, root:string ) {
	return {
		d:chainable_dir.bind({path,root}),
		dir:chainable_dir.bind({path,root}),
		with:chainable_dir.bind({path,root}, ''),
		w:chainable_dir.bind({path,root}, ''),
	} as TreeMaker;
}