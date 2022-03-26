/* eslint-disable @typescript-eslint/ban-ts-comment */
jest.mock('@gerard2p/mce/mockable/fs')
process.env.MCE_DEV = 'true'
process.env.MCE_TEST = 'test'
process.env.MCE_VERBOSE = '0'
export { input, output } from '@gerard2p/mce/test'
import { existsSync, readdirSync } from '@gerard2p/mce/mockable/fs'
import { Execute, pack, Reset, SetCommandsLocation } from '@gerard2p/mce/test'
import { join, resolve } from 'path'
export { Reset, Execute }

const origin = join(__dirname, '../../')
SetCommandsLocation('./test/demo_project')

export function SetProjectPath(path: string) {
	process.chdir(join(origin, path))
	process.argv.push('', resolve())
	SetCommandsLocation(join(origin, path))
}
export function Restore() {
	process.chdir(origin)
}
class CommandFinder {
	commands(...files: string[]) {
		existsSync.mockReturnValueOnce(files.length>0)
		readdirSync.mockReturnValueOnce(files)
		return this
	}
	plugins(modules: Record<string, string[]>) {
		const [dependency, ...devDependencies] = Object.keys(modules)
		pack({
			dependencies: { [dependency]: 'x.x.x' },
			devDependencies: devDependencies.reduce(( dependencies, dependency) => {
				dependencies[dependency] = 'x.x.x'
				return dependencies
			}, {}),
		})
		for(const commands of Object.values(modules)) {
			pack({ keywords: ['test-commands'] })
			this.commands(...commands)
		}
		return this
	}
	locals(...files: string[]) {
		this.commands(...files)
		return this
	}
}
export const find = new CommandFinder()