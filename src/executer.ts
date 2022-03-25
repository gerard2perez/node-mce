/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: executer.ts
Created:  2022-01-30T04:26:12.869Z
Modified: 2022-03-24T23:53:46.993Z
*/
import { callerPath, cliPath, PackageJSON } from '.'
import { DefaultHelpRenderer } from './@utils/help.renderer'
import { DefaultTheme } from './@utils/theme'
import { readdirSync } from './mockable/fs'
import { Argument, Option, Command, print } from './core'
import { LoadModule } from './module-loader'
import { basename, join } from 'path'
import { subCommandCompletition } from './completition/subcommands'
import { UseSourceMaps } from './@utils/user-sourcemaps'
import { locations } from './program'
import { ARGUMENT_COUNT_ERROR, MCError } from './@utils/mce-error'
process.env.MCE_VERBOSE = 0 as any
const pathMapping = new Map<string, string>()
function findCommands(path: string, prefix = '') {
	const res = readdirSync(path).filter(p => !p.endsWith('.map') && !p.endsWith('.d.ts')).map(p => p.replace('.js', '').replace('.ts', ''))
	for(const filePath of res) {
		pathMapping.set(prefix+basename(filePath), join(path, filePath))
	}
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
function LoadPlugins(keyword: string) {
	try {
		const {dependencies, devDependencies} = new PackageJSON(cliPath('package.json').replace('src', '').replace('dist', ''))
		const packages = Object.keys({...dependencies, ...devDependencies})
		for(let i=0; i< packages.length; i++) {
			const { keywords = [], name } = new PackageJSON(callerPath('node_modules', packages[i], 'package.json'))
			if(keywords.includes(keyword)) {
				const commandsPath = callerPath('node_modules', packages[i], '@commands')
				//TODO: find commands must return a fully qualified path
				findCommands(commandsPath, packages[i]+':')
			}
		}
		
	} catch (_err) {
		void 0
	}
}
async function versionRequested(preArguments: string[]) {
	const version = new Option({kind: 'boolean', defaults: false, property: 'version'}, '', '')
	if(version.match(preArguments)) {
		const pack = await import(cliPath('package.json').replace('src', '').replace('dist', ''))
		print`${pack.version}`
		return pack.version
	}
	return undefined
}
async function renderHelp(helpRequested: boolean, requestedCMD: string, commandName: string) {
	if(helpRequested) {
		const hRenderer = new DefaultHelpRenderer(DefaultTheme)
		const commadFileNames = requestedCMD ? [[requestedCMD, pathMapping.get(requestedCMD)]] as [string, string][] : Array.from(pathMapping.entries())
		const commandCtrs = await Promise.all(commadFileNames.map(([forceName, requestedCMD]) => LoadModule(requestedCMD, forceName)))
		hRenderer.render(commandName, commandCtrs.map(b => new b()), commadFileNames.length > 1)
		return true
	}
	return false
}
export async function ExecuterDirector(argv: string[], locals?: string, plugins?: string): Promise<unknown> {
	const [_, _cmdName, ...preArguments] = argv.join('=').split('=')
	locations(_, _cmdName)
	const commandName = basename(_cmdName)
	const version = await versionRequested( preArguments ) 
	if(version) return version

	const help = new Option({ kind: 'boolean', defaults: false, property: 'help' }, '', '-h' )
	const helpRequested: boolean = help.match(preArguments)
	const verbosity = new Option({ kind: 'verbosity', defaults: undefined, property: 'verbose', allowMulti: true }, '', '-v' )
	process.env.MCE_VERBOSE = verbosity.match(preArguments).toString()

	try {
		findCommands(cliPath('commands'))
		if(plugins) {
			LoadPlugins(plugins)
		}
		if(locals) {
			findCommands(callerPath(`@${locals}`), 'l:')
		}
		// if(await checkCompletition(commadFileNames, argv)) {
		// 	process.exit(0)
		// }
		const { requestedCMD, programArgs } = findRequestedCommand(preArguments)
		return await renderHelp(helpRequested, requestedCMD, commandName)
			|| await hydrateCommand(requestedCMD, programArgs)
	} catch(err) {
		await UseSourceMaps(err)
		console.log(err)
		if(process.env.MCE_THROW_ERROR === 'true') {
			throw err
		} else {
			print`{warning|ico|red|bold} ${err.stack}`
		}
	}
}
function findRequestedCommand( preArguments: string[] ) {
	const multiCommands = pathMapping.size > 1
		let [requestedCMD, ...programArgs] = preArguments
		if(!multiCommands) {
			programArgs = [requestedCMD, ...programArgs].filter(f => f)
			pathMapping.set('index', cliPath('index'))
			requestedCMD = 'index'
		}
		if(requestedCMD && !pathMapping.has(requestedCMD)) {
			throw new MCError(0, `The requested command '{${requestedCMD}|cyan}' does not exists\n  Options: ${Array.from(pathMapping.keys()).join('  ')}\n`)
		}
		return { requestedCMD, programArgs}
}

async function hydrateCommand(requestedCMD: string, programArgs: string[]) {
	const Command = new (await LoadModule( pathMapping.get(requestedCMD)))
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
	if(arg_count !== len) {
		throw new MCError(ARGUMENT_COUNT_ERROR, 'Argument count missmatch' +`${arg_count}!=${len}`)
	}
	return await Command.action(...final_args)
}

function applyLegacyFixtures(mappedOptions: { index: number; tag: string; value: unknown }[], Command: Command, final_args: unknown[]) {
	mappedOptions.reduce((command, option) => {
		if(option.tag === 'verbose') option.value = parseInt(process.env.MCE_VERBOSE)
		if(option.tag === 'dryRun' && option.value) {
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

