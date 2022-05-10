/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: verbosity.ts
Created:  2022-03-17T05:46:01.690Z
Modified: 2022-03-26T04:18:03.288Z
*/
import { MainSpinner } from '../spinner'
import { tagCompiler } from '../tag-compiler'

export function verbosity(lvl: number) {
	if( parseInt(process.env.MCE_VERBOSE) >= lvl) {
		return (text: TemplateStringsArray, ...values: any[]) => { 
			MainSpinner.log`${tagCompiler(text, ...values)}\n`
		}	
	}
	return () => void 0
}
