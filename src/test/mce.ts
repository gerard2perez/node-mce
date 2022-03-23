import { SetStreams } from '../system-streams'
import { readdirSync } from '../mockable/fs'
import { STDIn } from './stdin'
import { STDOut } from './stdout'
export const output = new STDOut
export const input = new STDIn
SetStreams(output, input)
import { Program } from '../director'
let NODE_MCE: Program
export function SetCommandsLocation(path: string) {
	NODE_MCE = new Program(path)
	return NODE_MCE
}
export async function SingleStyle(command: string) {
    output.clear()
	readdirSync.mockReset()
	readdirSync.mockReturnValueOnce([])
    const result = await NODE_MCE.execute(['node', 'mce', ...command.split(' ')], {single: true})
    return output.content || result
}
export async function GitStyle(command: string) {
	output.clear()
	const result = await NODE_MCE.execute(['node', 'mce', ...command.split(' ')], {locals: true})
	return output.content || result
}
export async function WithPlugins(keyword: string, command: string) {

	output.clear()
	await NODE_MCE.execute(['node', 'mce', ...command.split(' ')], {locals: true, plugins: 'mce'})
	return output.content
}
export async function Reset() {
	process.env.MCE_DRY_RUN = undefined
	jest.resetAllMocks()
}
