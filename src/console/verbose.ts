/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: verbose.ts
Created:  2022-03-17T05:46:01.690Z
Modified: 2022-03-23T00:59:35.616Z
*/
/* eslint-disable @typescript-eslint/no-empty-function */
import { MainSpinner } from '../spinner'
import { tagcompiler } from './tag-compiler'

export function verbosity(lvl: number, newLine?: boolean) {
	newLine = newLine !== false
	if( parseInt(process.env.MCE_VERBOSE) >= lvl) {
		return (text: TemplateStringsArray, ...values: any[]) => { 
			MainSpinner.log`${tagcompiler(text, ...values)}${newLine?'\n':''}`
		}	
	}
	return () => {}
}
