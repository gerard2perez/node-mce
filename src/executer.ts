/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: executer.ts
Created:  2022-01-30T04:26:12.869Z
Modified: 2022-03-24T09:18:41.033Z
*/
import { cliPath } from '.'
import { DefaultHelpRenderer } from './@utils/help.renderer'
import { DefaultTheme } from './@utils/theme'
import { readdirSync } from './mockable/fs'
import { Argument, Option, error, Command, exit, print, opt } from './core'
import { LoadModule } from './module-loader'
import { basename } from 'path'
import { subCommandCompletition } from './completition/subcommands'
import { UseSourceMaps } from './@utils/user-sourcemaps'
import { locations } from './program'
import { ARGUMENT_COUNT_ERROR, MCError } from './@utils/mce-error'
process.env.MCE_VERBOSE = 0 as any
function findCommands(path: string) {
	const res = readdirSync(path).filter(p => !p.endsWith('.map') && !p.endsWith('.d.ts')).map(p => p.replace('.js', '').replace('.ts', ''))
	return res
}
async function checkCompletition(commands: string[], argv: string[]) {
	const [_, _ptcmd, fullcommand = '', ...preArguments] = argv
	const [_cmdName, suncommand] = fullcommand.split(' ')	
	const completeOpt = new Option({ kind: 'string', defaults: undefined, property: 'complete' }, '', '' )
	const indexOpt = new Option({ kind: 'number', defaults: undefined, property: 'index' }, '', '' )
	const _index = indexOpt.match<number>(preArguments)
	const complete = completeOpt.match<string>(preArguments)
	if(fullcommand && _index) {
		await subCommandCompletition(_cmdName, complete, suncommand, commands)
		return true
	}
	return false
}
export async function ExecuterDirector(argv: string[]): Promise<unknown> {
	try {
		let commadFileNames = findCommands(cliPath('commands'))
		const [_, _cmdName, ...preArguments] = argv.join('=').split('=')
		locations(_, _cmdName)
		// if(await checkCompletition(commadFileNames, argv)) {
		// 	console.log('existsdasd')
		// 	process.exit(0)
		// }
		const commandName = basename(_cmdName)
		const help = new Option({ kind: 'boolean', defaults: false, property: 'help' }, '', '-h' )
		const verbosity = new Option({ kind: 'verbosity', defaults: undefined, property: 'verbose', allowMulti: true }, '', '-v' )
		const version = new Option({kind: 'boolean', defaults: false, property: 'version'}, '', '')
		
		if(version.match(preArguments)) {
			const pack = await import(cliPath('package.json').replace('src', '').replace('dist', ''))
			print`${pack.version}`
			return pack.version
		}
		process.env.MCE_VERBOSE = verbosity.match(preArguments).toString()

		const helpRequested = help.match(preArguments)
		const isSubcommands = commadFileNames.length > 1
		let [requestedCMD, ...programArgs] = preArguments
		if(!isSubcommands) {
			programArgs = [requestedCMD, ...programArgs].filter(f => f)
			commadFileNames.push('../index')
			requestedCMD = commadFileNames[0]
		}
		if(requestedCMD && !commadFileNames.includes(requestedCMD)) {
			error`The requested command '{${requestedCMD}|cyan}' does not exists`
			exit(1)`\n  Options: ${commadFileNames.join('  ')}\n`
		}
		if(helpRequested) {
			const hRenderer = new DefaultHelpRenderer(DefaultTheme)
			commadFileNames = requestedCMD ? [requestedCMD] : commadFileNames
			const commandCtrs = await Promise.all(commadFileNames.map(requestedCMD => LoadModule(cliPath('commands', requestedCMD))))
			hRenderer.render(commandName, commandCtrs.map(b => new b()), commadFileNames.length > 1)
		} else {
			const finelResult = await hydrateCommand(requestedCMD, programArgs)
			return finelResult
		}
	} catch(err) {
		await UseSourceMaps(err)
		if(process.env.MCE_THROW_ERROR === 'true') {
			throw err
		} else {
			print`{warning|ico|red|bold} ${err.stack}`
		}
	}
}

async function hydrateCommand(requestedCMD: string, programArgs: string[]) {
	const Command = new (await LoadModule(cliPath('commands', requestedCMD)))
	const options = Option.Get(Command)
	const argus = Argument.Get(Command)
	const mappedOptions = options.map((opt, idx) => ({ index: idx, tag: opt.name, value: opt.match(programArgs) }))
	const iligalOptions = programArgs.filter(parg => parg.includes('-', 0))
	if (iligalOptions.length) {
		throw new Error(`This command does not support this options: ${iligalOptions.join(', ')}`)
	}
	const mappedArguments = argus.map(argument => ({ index: argument.index, tag: argument.name, value: argument.match(programArgs) }))
	const final_args = [...mappedArguments].sort((a, b) => a.index - b.index).map(arg => arg.value)
	const isLegacy = applyLegacyFixtures(mappedOptions, Command, final_args)
	const arg_count = argus.length + (isLegacy && options.length>0 ? 1 : 0)
	const len = Command.action.length || 1
	console.log({arg_count, len, l: final_args.length, isLegacy, o: options.length, a: argus.length })
	if(arg_count !== len) {
		throw new MCError(ARGUMENT_COUNT_ERROR, 'Argument count missmatch' +`${arg_count}!=${len}`)
	}
	return await Command.action(...final_args)
}

function applyLegacyFixtures(mappedOptions: { index: number; tag: string; value: unknown }[], Command: Command, final_args: unknown[]) {
	mappedOptions.reduce((command, option) => {
		if(option.tag === 'verbose') option.value = parseInt(process.env.MCE_VERBOSE)
		if(option.tag === 'dryRun') {
			process.env.MCE_DRY_RUN = 'true'
		}
		if ((command as any)._legacyOptions) {
			(command as any)._legacyOptions[option.tag] = option.value
		} else {
			command[option.tag] = option.value
		}
		return command
	}, Command)
	if ((Command as any)._legacyOptions) {
		final_args.push((Command as any)._legacyOptions)
		return true
	} else {
		// eslint-disable-next-line prefer-spread
		final_args = [].concat.apply([], final_args)
		return false
	}
}