/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: executer.ts
Created:  2022-01-30T04:26:12.869Z
Modified: 2022-03-19T02:40:33.197Z
*/
import { cliPath } from '.'
import { DefaultHelpRenderer } from './@utils/help.renderer'
import { DefaultTheme } from './@utils/theme'
import { readdirSync } from './mockable/fs'
import { Argument, Option, error, Command, exit } from './core'
import { LoadModule } from './module-loader'
import { basename } from 'path'
import { subCommandCompletition } from './completition/subcommands'
import { UseSourceMaps } from './@utils/user-sourcemaps'
process.env.MCE_VERBOSE = 0 as any
function findCommands(path: string) {
	return readdirSync(path).filter(p => !p.endsWith('.map') && !p.endsWith('.d.js')).map(p => p.replace('.js', ''))
}
async function checkCompletition(commands: string[]) {
	const [_, _ptcmd, fullcommand = '', ...preArguments] = process.argv
	const [_cmdName, suncommand] = fullcommand.split(' ')	
	const completeOpt = new Option({ kind: 'string', defaults: undefined, property: 'complete' }, '', '' )
	const indexOpt = new Option({ kind: 'number', defaults: undefined, property: 'index' }, '', '' )
	const _index = indexOpt.match<number>(preArguments)
	const complete = completeOpt.match<string>(preArguments)
	if(fullcommand && _index) {
		await subCommandCompletition(complete, suncommand, commands)
		return true
	}
	return false
}
export async function ExecuterDirector(subcommands: boolean) {
	try {
		let commadFileNames = findCommands(cliPath('commands'))
		const [_, _cmdName, ...preArguments] = process.argv
		
		if(await checkCompletition(commadFileNames)) {
			process.exit(0)
		}
		
		const commandName = basename(_cmdName)
		const help = new Option({ kind: 'boolean', defaults: 'false', property: 'help' }, '', '-h' )
		const verbosity = new Option({ kind: 'verbosity', defaults: undefined, property: 'verbosity', allowMulti: true }, '', '-v' )
		process.env.MCE_VERBOSE = verbosity.match(preArguments).toString()

		const helpRequested = help.match(preArguments)
		const isSubcommands = commadFileNames.length > 0
		let [requestedCMD, ...programArgs] = preArguments
		if(!isSubcommands) {
			programArgs = [requestedCMD, ...programArgs]
			requestedCMD = commadFileNames[0]
		}
		if(requestedCMD && !commadFileNames.includes(requestedCMD)) {
			error`The requested command '{${requestedCMD}|cyan}' does not exists`
			exit(1)`\n  Options: ${commadFileNames.join('  ')}\n`
		}
		if(helpRequested) {
			const hRenderer = new DefaultHelpRenderer(DefaultTheme)
			commadFileNames = requestedCMD ? [requestedCMD] : commadFileNames
			const commands = await Promise.all(commadFileNames.map(requestedCMD => LoadModule(cliPath('commands', requestedCMD))))
			hRenderer.render(commandName, commands.map(b => new b()), !subcommands)
			exit(2)``
		}
		await hydrateCommand(requestedCMD, programArgs)
	} catch(err) {
		await UseSourceMaps(err)
		exit(3)`{warning|ico|red|bold} ${err.stack}\n`
	}
}

async function hydrateCommand(requestedCMD: string, programArgs: string[]) {
	const Command = new (await LoadModule(cliPath('commands', requestedCMD)))
	const options = Option.Get(Command)
	const argus = Argument.Get(Command)
	const mappedOptions = options.map((opt, idx) => ({ index: idx, tag: opt.name, value: opt.match(programArgs) }))
	const iligalOptions = programArgs.filter(parg => parg.includes('-', 0))
	if (iligalOptions.length) {
		throw new Error(`This command does not support this optinos: ${iligalOptions.join(', ')}`)
	}
	const mappedArguments = argus.map(opt => ({ index: opt.index, tag: opt.name, value: opt.match(programArgs) }))
	const final_args = [...mappedArguments].sort((a, b) => a.index - b.index).map(arg => arg.value)
	applyLegacyFixtures(mappedOptions, Command, final_args)
	// eslint-disable-next-line prefer-spread
	await Command.action.apply(Command, [].concat.apply([], final_args))
}

function applyLegacyFixtures(mappedOptions: { index: number; tag: string; value: unknown }[], Command: Command, final_args: unknown[]) {
	mappedOptions.reduce((command, option) => {
		if ((command as any)._legacyOptions) {
			(command as any)._legacyOptions[option.tag] = option.value
		} else {
			command[option.tag] = option.value
		}
		return command
	}, Command)
	if ((Command as any)._legacyOptions) {
		final_args.push((Command as any)._legacyOptions)
	}
}
