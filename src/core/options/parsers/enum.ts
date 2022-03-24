/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: enum.ts
Created:  2022-03-24T04:58:55.502Z
Modified: 2022-03-24T07:43:13.465Z
*/

import { IOptionParser } from '../custom'
import { RegisterClassParser } from './register-parser'

declare global {
	namespace MCE {
		interface ValueParsers {
			enum()
		}
	}
}

@RegisterClassParser
export class EnumParser implements IOptionParser {
	parseValue(str: string|number, _enum: unknown): unknown {
		if(typeof str === 'number') {
			return _enum[str]
		}
		return str // || _enum[0]
	}
	helpLongTag(tag: string): [tag: string, param: string] {
		return [`--${tag}`, `<${tag}>`]
	}
	helpDefaults(data: string, _enum: unknown): string {
		if(!_enum) return ''
		const keys = Object.values(_enum).filter(v => typeof v !== 'number' && v !== data)
		if(!data)data = keys.shift()
		return `[{${data}|bold|underline}, ${keys.join(', ')}]`
	}
	
}

