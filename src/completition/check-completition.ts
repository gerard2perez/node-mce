/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: check-completition.ts
Created:  2022-03-26T04:57:49.626Z
Modified: 2022-03-26T04:58:39.978Z
*/
import { Option } from '../core'
import { subCommandCompletition } from './subcommands'
export async function checkCompletition(commands: string[], argv: string[]) {
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