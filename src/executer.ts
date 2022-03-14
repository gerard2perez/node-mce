/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: executer.ts
Created:  2022-01-30T04:26:12.869Z
Modified: 2022-03-14T19:21:16.064Z
*/
import { basename } from 'path'
import { cliPath } from '.'
import { DefaultHelpRenderer } from './@utils/help.renderer'
import { DefaultTheme } from './@utils/theme'
import { readdirSync } from './mockable/fs'
import { Argument, Command, Insert, mArguments, mOptions, Option } from './core'
type Ctor =  new () => Command
async function LoadModule(path: string): Promise<Ctor|undefined> {
	return await import(path).then(m => {
		if(m.default) {
			return m.default
		} else {
			console.warn('This kind of module is deprecated, please migrate to class module')
			console.log(m)
			const fname = basename(path)
			const inFly = {
				[fname]: class extends Command {
				async action(...args: any[]) {
					await m.action(...args)
				} 
			}
		}
		const nclass = inFly[fname]
			
			// (inFly as any).name = basename(path)
			Insert(
				mOptions,
				new Option(
					{kind: 'boolean', defaults: undefined, property: 'help'},
					'',
					'-h'
				),
				nclass.prototype

			)
			return nclass
		}
		
	}).catch(_ => undefined)
}
export async function ExecuterDirector(subcommands: boolean) {
	let [_, __, requestedCMD, ...programArgs] = process.argv
	let commandCtr: Ctor
	if(!subcommands) {
		programArgs = [requestedCMD, ...programArgs]
	} else {
		commandCtr = await LoadModule(`./commands/${requestedCMD}`)
	}
	const help = new Option(
		{kind: 'boolean', defaults: undefined, property: 'help' },
		'',
		'-h'
	)
	if(help.match(programArgs) || !commandCtr) {
		const hRenderer = new DefaultHelpRenderer(DefaultTheme)

		let bcommands: Ctor[] = [commandCtr]
		if(!commandCtr) {
			const commands = readdirSync(cliPath('commands')).filter(p => p.includes('.js')).map(p => p.replace('.js', ''))
			bcommands = (await Promise.all(
				commands
					.map(command => LoadModule(`./commands/${command}`))
					
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
			command[option.tag] = option.value
			return command
		}, Command)
		// eslint-disable-next-line prefer-spread
		await Command.action.apply(Command, final_args)


		
	}
}