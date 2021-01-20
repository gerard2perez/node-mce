import type { MCEProgram } from '../mce-cli'
import { SetStreams } from '../system-streams'
import { STDIn } from './stdin'
import { STDOut } from './stdout'

process.env.MCE_DEV = 'true'
export const output = new STDOut
export const input = new STDIn
SetStreams(output, input)

let NODE_MCE: Promise<MCEProgram>;
export function SetCommandsLocation(path: string) {
	// @ts-ignore
	NODE_MCE = import('..').then(({MCE}) => {
		return MCE(path) as MCEProgram;
	})
}

export async function SingleStyle(command: string) {
    output.clear()
    await (await NODE_MCE).command(command.split(' '))
    return output.content
}
export async function GitStyle<T=string>(command: string) {
	output.clear()
	return (await NODE_MCE)
		.gitStyle<T>(command.split(' '))
		.then(result=>{
			return output.content || result
		})
}
export async function WithPlugins<T=string>(keyword: string, command: string) {
	output.clear()
	return (await NODE_MCE)
		.withPlugins<T>(keyword, command.split(' '))
		.then(result=>{
			return output.content || result
		})
}
export async function Reset() {
	// @ts-ignore
	(await NODE_MCE).commandMapping = new Map();
	// @ts-ignore
	(await NODE_MCE).commands_map = {
		_owned: [],
		_local: [],
		plugins: []
	};
}