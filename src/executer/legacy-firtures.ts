/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: legacy-firtures.ts
Created:  2022-03-26T04:51:24.936Z
Modified: 2022-03-26T04:51:56.345Z
*/

import { Command } from '../core'

export function applyLegacyFixtures(mappedOptions: { index: number; tag: string; value: unknown }[], Command: Command, final_args: unknown[]) {
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