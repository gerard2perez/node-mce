/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: execute-director.ts
Created:  2022-01-31T07:37:27.395Z
Modified: 2022-03-26T05:12:03.160Z
*/
import { basename } from 'path'
import { locations } from '../program'
import { callerPath, cliPath } from '../fs'
import { findCommands } from './find-commands'
import { LoadPlugins } from './load-plugin'
import { pathMapping } from './path-mapper'
import { Option, print } from '../core'
import { helpRenderer } from './help-renderer'
import { hydrateCommand } from './hydrate-command'
import { UseSourceMaps } from '../@utils/user-sourcemaps'
import { versionReporter } from './version-reporter'
import { MCError } from '../@utils/mce-error'

type SingleCommand = {
	single: true
	silentError?: boolean
}

type GitStyle = {
	locals?: string
	plugins?: string
	silentError?: boolean
}

export class CLIExecuter {
	constructor(root: string) {
		process.env.MCE_ROOT = root
	}
	async execute<T=unknown>(argv: string[], data: GitStyle): Promise<T>
	async execute<T=unknown>(argv: string[], data: SingleCommand): Promise<T>
	async execute<T=unknown>(argv: string[], _data: GitStyle|SingleCommand) {
		process.env.MCE_THROW_ERROR = _data.silentError ? 'false' : 'true'
		const {plugins, locals} = _data as GitStyle
		pathMapping.clear()
		const [_, _cmdName, ...preArguments] = argv.join('=').split('=')
		locations(_, _cmdName)
		const commandName = basename(_cmdName)
		const version = await versionReporter( preArguments ) 
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
			// TODO: make a script to install completition, in powershel and 
			// TODO: maybe use ommelette for other shells
			// if(await checkCompletition(commadFileNames, argv)) {
			// 	process.exit(0)
			// }
			const { requestedCMD, programArgs } = this.patchRequestedCommand(preArguments)
			return await helpRenderer(helpRequested, requestedCMD, commandName)
				|| await hydrateCommand(requestedCMD, programArgs)
		} catch(err) {
			await UseSourceMaps(err)
			if(process.env.MCE_THROW_ERROR === 'true') {
				throw err
			} else {
				print`{warning|ico|red|bold} ${err.stack}`
			}
		}
	}
	private patchRequestedCommand( preArguments: string[] ) {
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
}