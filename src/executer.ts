/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: executer.ts
Created:  2022-01-30T04:26:12.869Z
Modified: 2022-03-14T22:10:35.980Z
*/
import { basename } from 'path'
import { cliPath } from '.'
import { DefaultHelpRenderer } from './@utils/help.renderer'
import { DefaultTheme } from './@utils/theme'
import { readdirSync } from './mockable/fs'
import { Command as OldCommand, OptionKind, Parser} from './legacy_core'
import { Argument, Command, Insert, mArguments, mOptions, opt, Option } from './core'
import { print } from './console'
type Ctor =  new () => Command
async function LoadModule(path: string): Promise<Ctor|undefined> {
	return await import(path + '.js').then(m => {
		if(m.default) {
			return m.default
		} else {
			const fname = basename(path)
			const inFly = {
				[fname]: class extends Command {
					public _legacyOptions = {}
					async action(...args: any[]) {
						await m.action(...args)
					}
				}
			}
			const nclass = inFly[fname]
			print`{warning|sy|red} {This kind of module is deprecated, please migrate to class module|yellow}\n\n`

			const ocmd = new OldCommand('mce', basename(path), m, false)
			for(const oArg of ocmd.arguments) {
				const nArg = new Argument({
					defaults: undefined,
					kind: oArg.type as any,
					optional: oArg.kind === OptionKind.optional,
					rest: oArg.kind === OptionKind.varidac,
					property: oArg.name
				}, null, ocmd.arguments.indexOf(oArg))
				Insert( mArguments, nArg, nclass.prototype )
			}
			for(const oOpt of ocmd.options) {
				const meta = {
					defaults: oOpt.defaults,
					kind: undefined,
					property: oOpt.name,
				}
				switch(oOpt.parser) {
					case Parser.list:
						meta.kind = 'List<string>'
						break
					case Parser.collect:
						meta.kind = 'Collection<string>'
						break
					case Parser.truefalse:
						meta.kind = 'boolean'
						break
					default:
						meta.kind = 'string'
						break
				}
				const nArg = new Option(meta, oOpt.tag_desc, oOpt.short)
				Insert( mOptions, nArg, nclass.prototype )
			}
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
	}).catch(_ => {
		throw _
	})
}
export async function ExecuterDirector(subcommands: boolean) {
	let [_, __, requestedCMD, ...programArgs] = process.argv
	let commandCtr: Ctor
	if(!subcommands) {
		programArgs = [requestedCMD, ...programArgs]
	} else {
		commandCtr = await LoadModule(cliPath('commands', requestedCMD))
	}
	const help = new Option(
		{ kind: 'boolean', defaults: undefined, property: 'help' },
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
		await Command.action.apply(Command, final_args)
	}
}