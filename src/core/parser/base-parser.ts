/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: base-parser.ts
Created:  2022-03-27T01:55:35.218Z
Modified: 2022-03-27T05:34:43.623Z
*/

export abstract class BaseParser {
	arrayParser(data: unknown[]): unknown[]
	arrayParser(data: string): string[]
	arrayParser(data: string|unknown[]) {
		if(data instanceof Array) return data
		return data.split(',')
	}
	parseValue(value: unknown, ...extra: unknown[]): unknown {
		return value
	}
	helpLongTag(tag: string, name?: string): [tag:string, param: string] {
		return [tag, `<${name}>`]
	}
	helpDefaults(tag: string, ...values: unknown[]): string {
		return tag ? `${tag}` : ''
	}
}