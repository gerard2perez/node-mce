/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: args9.ts
Created:  2022-03-27T17:22:57.894Z
Modified: 2022-03-27T17:31:34.971Z
*/

import { arg, Command } from '@gerard2p/mce'

export default class Arg9Command extends Command {
	async action(
		@arg arg1: number,
		@arg ...arg2: string[]
	) {
		return {
			arg1,
			arg2
		}
	}
}