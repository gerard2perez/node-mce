/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: hydrate-command.ts
Created:  2022-03-26T04:50:37.117Z
Modified: 2022-03-27T17:43:11.875Z
*/
import { Argument, Option } from '../core'
import { LoadModule } from '../module-loader'
import { ARGUMENT_COUNT_ERROR, UNEXPECTED_ARGUMENTS_PASSED, MCError } from '../@utils/mce-error'
import { pathMapping } from './path-mapper'
import { applyLegacyFixtures } from './legacy-firtures'
export async function hydrateCommand(requestedCMD: string, programArgs: string[]) {
	const Command = new (await LoadModule( pathMapping.get(requestedCMD)))
	const options = Option.Get(Command)
	const argus = Argument.Get(Command)

	const mappedOptions = options.map((opt, idx) => ({ index: idx, tag: opt.name, value: opt.match(programArgs) }))
	const iligalOptions = programArgs.filter(parg => parg.includes('-', 0))
	if (iligalOptions.length) {
		throw new Error(`This command does not support this options: ${iligalOptions.join(', ')}`)
	}
	let hasSpredArguments = false
	const mappedArguments = argus.map(argument => {
		hasSpredArguments = argument.rest
		return { index: argument.index, tag: argument.name, value: argument.match(programArgs) }
	})
	const final_args = [...mappedArguments].sort((a, b) => a.index - b.index).map(arg => arg.value)
	const isLegacy = applyLegacyFixtures(mappedOptions, Command, final_args)
	const arg_count =  (Command as any).arg_count || argus.length
	const len = final_args.length + programArgs.length
	if(programArgs.length) {
		throw new MCError(UNEXPECTED_ARGUMENTS_PASSED, `Unexpected arguments passed: ${programArgs.join(', ')}`)
	}
	if(arg_count !== len) {
		throw new MCError(ARGUMENT_COUNT_ERROR, 'Argument count missmatch' +`${arg_count}!=${len}`)
	}
	if(hasSpredArguments && !isLegacy) {
		const spread = final_args.pop() as unknown[]
		final_args.push(...spread)
	}
	return await Command.action(...final_args)
}