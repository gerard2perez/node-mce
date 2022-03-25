/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: verbosity.ts
Created:  2022-03-23T21:38:52.029Z
Modified: 2022-03-25T18:14:11.648Z
*/

import { IOptionParser } from './option-parser'
import { RegisterClassParser } from './register-parser'
declare global {
	namespace MCE {
		interface ValueParsers {
			verbosity()
		}
	}
}

@RegisterClassParser
export class VerbosityParser extends IOptionParser {
	parseValue(str: string): unknown {
		return str ? str.split(',').length : 0
	}
	helpLongTag(tag: string): [tag: string, param: string] {
		return [tag, '']
	}
	helpDefaults(data: unknown): string {
		return ''
	}
	
}
export type Verbosity = number