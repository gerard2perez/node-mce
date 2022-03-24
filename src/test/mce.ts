import { SetStreams } from '../system-streams'
import { STDIn } from './stdin'
import { STDOut } from './stdout'
export const output = new STDOut
export const input = new STDIn
SetStreams(output, input)
import { Program } from '../director'
let NODE_MCE: Program
type Options = {plugins: string, locals: string}
export function SetCommandsLocation(path: string) {
	NODE_MCE = new Program(path)
	return NODE_MCE
}
export async function Execute(command: string, {plugins, locals}: Options = {} as Options ) {
    output.clear()
    const result = await NODE_MCE.execute(['node', 'demo', ...command.split(' ')], {plugins, locals})
	return result === true  ? output.content : output.content || result
}
export async function Reset() {
	process.env.MCE_DRY_RUN = undefined
	jest.resetAllMocks()
}
