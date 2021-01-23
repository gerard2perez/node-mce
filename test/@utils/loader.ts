/* eslint-disable @typescript-eslint/ban-ts-comment */
process.env.MCE_DEV = 'true'
process.env.TEST = 'test'
import { existsSync, readdirSync } from '@gerard2p/mce/mockable/fs'
import { GitStyle, Reset, SetCommandsLocation, SingleStyle, WithPlugins } from '@gerard2p/mce/test'
import { join, resolve } from 'path'
export { input, output } from '@gerard2p/mce/test'
export { SingleStyle, GitStyle, Reset, WithPlugins }

const origin = join(__dirname, '../../')
SetCommandsLocation('./test/demo_project')

export function SetProjectPath(path: string){
	process.chdir(join(origin, path))
	process.argv.push('', resolve())
	SetCommandsLocation(join(origin, path))
}
export function Restore() {
	process.chdir(origin)
}
export function findCommands(...files: string[]) {
	// @ts-ignore
	existsSync.mockReturnValueOnce(files.length>0)
	// @ts-ignore
	readdirSync.mockReturnValueOnce(files)
}