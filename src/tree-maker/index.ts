import { join } from 'path'
import { compile, copy, mkdir, write, writeJSON, remove } from './fs'
import { makeChainableDir, chainable, chainable_dir, makeChainable } from './wrappers'
export { PackageJSON } from '../@utils/package-json'
function _root(root: string){
	this.path = join(this.path, root)
	const path = this.path
	mkdir.bind({project: (...args) => join(...args)})(path)
	return makeChainableDir(path, root)
}
export const json = makeChainable(writeJSON)
/**
 * Initiates a filesystem building tree
 */
export const root = ((folder: string) => _root.bind({path: ''})(folder)) as typeof _root
/**
 * create a directory that can contain multiple actions
 */
export const dir = makeChainable(chainable_dir)
/**
 * Copies a file from the cli root to the target application folder
 */
export const cpy = makeChainable(copy)
export const wrt = makeChainable(write)
/**
 * Compiles a file applying the data object to the source template
 */
export const cmp = makeChainable(compile)

// export { compile, copy, intercept, mkdir, write, template, project } from './fs';
export { TreeMaker } from './wrappers'
export { cpy as c, cmp as z, dir as d, root as r, wrt as w }
export function match(condition: boolean, fn: chainable): chainable {
	return condition ? fn:undefined
}
export { makeChainable, remove }
export { PackageJSON2Chain } from './package-json'