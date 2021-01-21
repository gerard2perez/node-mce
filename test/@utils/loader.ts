/* eslint-disable @typescript-eslint/ban-ts-comment */
process.env.MCE_DEV = 'true'
import { join, resolve } from 'path'
import { existsSync, readdirSync } from '../../src/fs'
import { GitStyle, Reset, SetCommandsLocation, SingleStyle, WithPlugins } from '../../src/test'
export { input, output } from '../../src/test'
export { SingleStyle, GitStyle, Reset, WithPlugins }

const origin = join(__dirname, '../../')
SetCommandsLocation('./test')

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