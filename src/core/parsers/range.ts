/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: rage.ts
Created:  2022-03-24T06:27:20.178Z
Modified: 2022-03-27T07:58:41.390Z
*/
import { IValueParser, BaseParser, RegisterClassParser, ITagParser } from '../parser'
declare global {
	namespace MCE {
		interface ValueParsers {
			range()
		}
		interface ListValueParsers {
			range()
		}
	}
}
@RegisterClassParser({tagHasValue: true})
export class RangeParser extends BaseParser implements ITagParser, IValueParser<unknown> {
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
	helpDefaults(data: unknown): string {
		if(data instanceof Array) {
			return data && data.length > 1 ? `[${data[0]}..${data[1]}]` : ''
		}
		return ''
	}
	
}
export type Range = [start: number, end: number]
