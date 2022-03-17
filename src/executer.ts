/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: executer.ts
Created:  2022-01-30T04:26:12.869Z
Modified: 2022-03-17T04:33:05.478Z
*/
import { cliPath } from '.'
import { DefaultHelpRenderer } from './@utils/help.renderer'
import { DefaultTheme } from './@utils/theme'
import { readdirSync } from './mockable/fs'
import { Argument, Option } from './core'
import { Ctor, LoadModule } from './module-loader'

export async function ExecuterDirector(subcommands: boolean) {
	//TODO: create VERBOSE option
	process.env.MCE_VERBOSE = 0 as any
	let [_, __, requestedCMD, ...programArgs] = process.argv
	let commandCtr: Ctor
	const help = new Option({ kind: 'boolean', defaults: undefined, property: 'help' }, '', '-h' )
	if(!subcommands) {
		programArgs = [requestedCMD, ...programArgs]
	} else if(programArgs.length > 1) {
		commandCtr = await LoadModule(cliPath('commands', requestedCMD))
	}
	
	if(help.match(programArgs) || !commandCtr) {
		const hRenderer = new DefaultHelpRenderer(DefaultTheme)

		let bcommands: Ctor[] = [commandCtr]
		if(!commandCtr) {
			const commands = readdirSync(cliPath('commands')).filter(p => p.endsWith('.js')).map(p => p.replace('.js', ''))
			bcommands = (await Promise.all(
				commands
					.map(command => LoadModule(cliPath('commands', command)))
					
		
					)).filter(c => c)
		}
		hRenderer.render('mce', bcommands.map(b => new b()), !subcommands)
	} else {
		const Command = new commandCtr()
		const options = Option.Get(Command)
		const argus = Argument.Get(Command)
		const mappedOptions = options.map( (opt, idx) => ({ index: idx, tag: opt.name, value: opt.match(programArgs)}))
		
		const iligalOptions = programArgs.filter(parg => parg.includes('-', 0))
		if(iligalOptions.length) {
			throw Error(`This command does not support this optinos: ${iligalOptions.join(', ')}`)
		}

		const mappedArguments = argus.map( opt => ({ index: opt.index, tag: opt.name, value: opt.match(programArgs)}))

	
		const final_args = [...mappedArguments ].sort( (a, b) => a.index - b.index ).map(arg => arg.value)
		
		mappedOptions.reduce((command, option) => {
			if((command as any)._legacyOptions) {
				(command as any)._legacyOptions[option.tag] = option.value
			} else {
				command[option.tag] = option.value
			}
			return command
		}, Command)
		if((Command as any)._legacyOptions) {
			final_args.push((Command as any)._legacyOptions)
		}
		// eslint-disable-next-line prefer-spread
		await Command.action.apply(Command, [].concat.apply([], final_args))
	}
}