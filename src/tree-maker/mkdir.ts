import { join, relative } from 'path'
import { mkdir as raw_mkdir } from '../fs'
import { fs_interface } from '../fs/interface'
import { PROJECT, TEMPLATE } from '../fs/resolvers'
import { Chainable, chainable } from './chainable'
export function mkdir(folder: string, ...operations: chainable[] ) {
	this.path = join(this.path, folder)
	const {path, root} = this
	raw_mkdir(path)
	for(const rtnOBJ of operations.filter(d => d) as Chainable[]) {
		const fsInterface: fs_interface = {
			root,
			path,
			template: (...args) => TEMPLATE(join(relative(root, path), ...args)),
			project: (...args) => PROJECT(join(path, ...args))
		}
		rtnOBJ.fn.bind(fsInterface)(...rtnOBJ.args)
	}
}
