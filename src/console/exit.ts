/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: exit.ts
Created:  2022-03-17T05:50:46.878Z
Modified: 2022-03-22T22:52:32.103Z
*/
import { tagcompiler } from './tag-compiler'

export function exit(code = 0) {
	return (text: TemplateStringsArray, ...values: any[]) => { 
		const message = tagcompiler(text, ...values)+'\n'
		// streams.output.write(message)
		throw new MCError(code, message)
		// process.exit(code)
	}
}
export class MCError extends Error {
	constructor(public exitCode: number, message: string) {
		super(message)
	}
}