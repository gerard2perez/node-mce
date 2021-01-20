import { join, relative } from 'path'
import { fs_interface, mkdir } from './fs'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface chainable {}
export type TreeMaker = { d: typeof chainable_dir, dir: typeof chainable_dir, with: (...operations: chainable[]) => TreeMaker, w: (...operations: chainable[]) => TreeMaker }
interface Chain {
	fn: any
	args: any[]
}
export function chainable_dir(folder: string, ...operations: chainable[] ) {
	const spath = this.path
	this.path = join(this.path, folder)
	const {path, root} = this
	if(folder) {
		
		mkdir.bind({project: (...args) => join(...args)})(path)
	}
	for(const rtnOBJ of operations.filter(d => d) as Chain[]) {
		const fsInterface: fs_interface = {
			root,
			path,
			template: (...args) => join(relative(root, path), ...args),
			project: (...args) => join(path, ...args)
		}
		rtnOBJ.fn.bind(fsInterface)(...rtnOBJ.args)
	}
	return makeChainableDir(spath, root)
}

export function makeChainableDir(path: string, root: string ) {
	return {
		d: chainable_dir.bind({path, root}),
		dir: chainable_dir.bind({path, root}),
		with: chainable_dir.bind({path, root}, ''),
		w: chainable_dir.bind({path, root}, ''),
	} as TreeMaker
}
export function makeChainable<T extends (...args: unknown[]) => unknown>(fn: T) {
	function wrapper(...args: any[]) {
		return {
		fn,
		args,
		}
	}
	return wrapper.bind({ fn }) as (...pams: Parameters<T>) => chainable
}
  