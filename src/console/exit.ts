/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: exit.ts
Created:  2022-03-17T05:50:46.878Z
Modified: 2022-03-17T05:50:59.846Z
*/

import { streams } from '../system-streams'
import { tagcompiler } from './tag-compiler'

export function exit(code = 0) {
	return (text: TemplateStringsArray, ...values: any[]) => { 
		streams.output.write(tagcompiler(text, ...values)+'\n')
		process.exit(code)
	}
}