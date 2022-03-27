/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: boolean.ts
Created:  2022-03-27T06:12:39.973Z
Modified: 2022-03-27T09:08:11.407Z
*/
import { IValueParser, RegisterClassParser, BaseParser } from '../parser'
declare global {
	namespace MCE {
		interface ValueParsers {
			boolean()
		}
	}
}
@RegisterClassParser({ tagHasValue: false})

export class BooleanParser extends BaseParser implements IValueParser<boolean> {
	parseValue(str: unknown, ...extra: unknown[]): boolean {
		if(typeof str === 'boolean') {
			return str
		} else {
			if(str=='true') return true
			if(str == 'false') return false
			return undefined
		}
	}

}