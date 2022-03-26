/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: rage.ts
Created:  2022-03-24T06:27:20.178Z
Modified: 2022-03-25T23:02:19.249Z
*/
import { IOptionParser } from './option-parser'
import { RegisterClassParser } from './register-parser'
declare global {
	namespace MCE {
		interface ValueParsers {
			range()
		}
	}
}
@RegisterClassParser()
export class RangeParser extends IOptionParser {
	parseValue(str: string|string[]): unknown {
		if( str instanceof Array) {
			return str
		} else {
			return str ? str.split('..').map(n => parseFloat(n)) : []
		}
	}
	helpLongTag(tag: string): [tag: string, param: string] {
		return [tag, '<a>..<b>']
	}
	helpDefaults(data: number[]): string {
		return data.length ? `[${data[0]}..${data[1]}]` : ''
	}
	
}
export type Range = [start: number, end: number]
