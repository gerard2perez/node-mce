/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: mce-error.ts
Created:  2022-03-23T16:59:17.536Z
Modified: 2022-03-23T17:06:55.038Z
*/

import { tagcompiler } from '../console'


export class MCError extends Error {
	constructor(public exitCode: number, message: string) {
		super( tagcompiler`${message}`)
		this.stack = this.stack.replace('Error', tagcompiler`{Error|red}`)
	}
}

export const ARGUMENT_ERROR = 1
export const OPTION_ERROR = 2