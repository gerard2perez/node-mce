/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: subcommands.ts
Created:  2022-03-18T23:47:40.659Z
Modified: 2022-03-22T16:34:11.646Z
*/

import { DefaultHelpRenderer } from '../@utils/help.renderer'
import { DefaultTheme } from '../@utils/theme'
import { Command, Option, cleanColor, tagcompiler } from '../core'
import { Trie } from '../dt/trie'
import { cliPath } from '../fs'
import { LoadModule } from '../module-loader'
async function completeCommands(cmd: string, input: string, commands: string[]) {
	const autocompleter = new Trie()
	commands.forEach(cmd => autocompleter.insert(cmd))
	const possibilities = (autocompleter.search(input).valueOf(input) || [commands.find(c => c===input)]).filter(f => f)

	const hRenderer = new DefaultHelpRenderer(DefaultTheme)
		const toRender = (await Promise.all(possibilities.map(r => {
			return LoadModule(cliPath('commands', r))
		}))).map(ctr => {
			const build = new ctr()
			// return Command.getName(ctr.prototype)
			return {
				command: Command.getName(ctr.prototype),
				header: cleanColor(tagcompiler`${hRenderer.header(cmd, commands.length===0, build)}`),
				help: cleanColor(tagcompiler`${hRenderer.generateHelp(cmd, build)}`)
			}
		})
		console.log(JSON.stringify(toRender))
		process.exit(0)
}
async function completeArgumentsFor(requestedCMD: string, input: string) {
	const command = new (await LoadModule(cliPath('commands', requestedCMD)))
	const autocompleter = new Trie()
	const _options = Option.Get(command)
	const options = [..._options.map(opt => opt.tag), ..._options.map(opt => opt.short)]
	options.forEach(opt => autocompleter.insert(opt))
	const possibilities = (autocompleter.search(input).valueOf(input) || [options.find(c => c===input)]).filter(f => f)
	const hRenderer = new DefaultHelpRenderer(DefaultTheme)
	const toRender = await Promise.all(possibilities.map(argument => {
		return {
			command: argument,
			header: argument,
			help: cleanColor(tagcompiler`${hRenderer.options(_options.find(opt => opt.tag === argument || opt.short === argument), 0, 20)}`),
		}
	}))
	console.log(JSON.stringify(toRender))
}
export async function subCommandCompletition(cmd: string, completitionText: string, requestedCMD: string, commands: string[]) {

	if(requestedCMD) {
		await completeArgumentsFor(requestedCMD, completitionText)
	} else {
		await completeCommands(cmd, completitionText, commands)
	}
}