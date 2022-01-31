/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: argument.ts
Created:  2022-01-30T03:32:50.703Z
Modified: 2022-01-31T07:20:26.984Z
*/
import { ValueParsers, GetParser} from './value-parser'
import { IParameter, mArguments, getMetadata } from './metadata'

export class Argument {
	static Get(target: unknown): Argument[] {
		return getMetadata(mArguments, target) || []
	}
	name: string
	defaults: unknown
	kind: Array<ValueParsers>
	rest: boolean
	constructor(option: IParameter, public description: string, public short: string, public index) {
		this.name = option.property
		const [_, k1, k2] = option.kind.match(/(.*)<(.*)>/) || [null, option.kind]
		this.kind = [k1, k2].filter(k => k).map(k => k.toLowerCase()) as Array<ValueParsers>
		this.defaults = option.defaults
	}
	parseValue(value: string) {
		const [first, second] = this.kind
		const parser1 = GetParser(first) || (str => str)
		const parser2 = GetParser(second) || (str => str)
		let result: unknown = parser1(value)
		if(result instanceof Array) {
			result = result.map(d => parser2(d)) as unknown
		}
		return result
	}
	match(args: string[]) {
		return this.parseValue( args.shift() || this.defaults as string)
	}
}