/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: native-types.ts
Created:  2022-03-27T07:18:00.513Z
Modified: 2022-03-27T09:07:52.025Z
*/
import { IValueParser, RegisterClassParser, BaseParser } from '../parser'
declare global {
	namespace MCE {
		interface ValueParsers {
			enum()
			int()
			float()
		}
		interface ListValueParsers {
			int()
			float()
		}
	}
}
@RegisterClassParser({
	tagHasValue: true
})
export class NumberParser extends BaseParser implements IValueParser<unknown> {
	parseValue(value: string, ..._extra: unknown[]): unknown {
		return parseInt(value) || undefined
	}

}
@RegisterClassParser({
	tagHasValue: true
})
export class IntParser extends BaseParser implements IValueParser<unknown> {
	parseValue(value: string, ...extra: unknown[]): unknown {
		return parseInt(value) || undefined
	}

}
export type Int = number

@RegisterClassParser({
	tagHasValue: true
})
export class FloatParser extends BaseParser implements IValueParser<unknown> {
	parseValue(value: string, ...extra: unknown[]): unknown {
		return parseFloat(value) || undefined
	}

}
export type Float = number

@RegisterClassParser({
	tagHasValue: true,
	repetableTag: false
})
export class ListParser extends BaseParser implements IValueParser<unknown> {
	parseValue(str: string|unknown[]): unknown {
		if(str instanceof Array) return str
		return str ? str.replace(/^\[|\]$/gm, '').split(',') : []
	}
}
export type List<T> = T[]

@RegisterClassParser({
	tagHasValue: true,
	repetableTag: true
})
export class CollectionParser extends BaseParser implements IValueParser<unknown> {
	parseValue(str: string|unknown[]): unknown {
		if(str instanceof Array) return str
		return str ? str.replace(/^\[|\]$/gm, '').split(',') : []
	}
}
export type Collection<T> = T[]