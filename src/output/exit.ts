/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: exit.ts
Created:  2022-03-17T05:50:46.878Z
Modified: 2022-03-23T17:00:50.686Z
*/
import { MCError } from '../@utils/mce-error'
import { tagCompiler } from './tag-compiler'

export function exit(code = 0) {
	return (text: TemplateStringsArray, ...values: any[]) => { 
		const message = tagCompiler(text, ...values)+'\n'
		// streams.output.write(message)
		throw new MCError(code, message)
		// process.exit(code)
	}
}
