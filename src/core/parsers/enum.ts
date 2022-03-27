/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: enum.ts
Created:  2022-03-24T04:58:55.502Z
Modified: 2022-03-27T08:57:43.543Z
*/

import { IValueParser, ITagParser, BaseParser, RegisterClassParser } from '../parser'

declare global {
	namespace MCE {
		interface ValueParsers {
			enum()
		}
	}
}

@RegisterClassParser()
export class EnumParser extends BaseParser implements ITagParser, IValueParser<number|string> {
	parseValue(str: string|number, _enum: unknown) {
		if( _enum instanceof Array) {
			return _enum.includes(str) ? str : undefined
		}
		if(typeof str === 'string') {
			return _enum[str]
		}
		return str // || _enum[0]
	}
	helpDefaults(data: string|number, _enum: unknown): string {
		if(!_enum) return ''
		if(typeof data === 'number') data = _enum[data]
		const keys = Object.values(_enum).filter(v => typeof v !== 'number' && v !== data)
		if(!data)data = keys.shift()
		return `[{${data}|bold|underline}, ${keys.join(', ')}]`
	}	
}
