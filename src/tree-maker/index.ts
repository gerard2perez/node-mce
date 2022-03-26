import * as fs from '../fs'
import { chainable, makeChainable, Chainable } from './chainable'
import { mkdir } from './mkdir'
/**
 * Initiates a filesystem building tree
 */
export function root(root: string, ...structure: chainable[]) {
	const {fn, args} = dir(root, ...structure) as Chainable
	return fn.bind({ root, path: ''})(...args)
}
/**
 * Writes an object as a json object
 */
export const json = makeChainable(fs.writeJSON)
/**
 * create a directory that can contain multiple actions
 */
export const dir = makeChainable(mkdir)
/**
 * Copies a file from the cli root to the target application folder
 */
export const cpy = makeChainable(fs.copy)
/**
 * Writes content in the specified file
 */
export const wrt = makeChainable(fs.write)
/**
 * Compiles a file applying the data object to the source template
 */
export const cmp = makeChainable(fs.compile)
/**
 * removes a file or a directory
 */
export const unl = makeChainable(fs.unlink)
export * from '../formatters'
export { PackageJSON2Chain } from './package-json'
// istanbul ignore next
export { makeChainable }
export function match(condition: boolean, fn: chainable): chainable {
	return condition ? fn:undefined
}
