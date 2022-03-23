/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: argument.ts
Created:  2022-01-30T03:32:50.703Z
Modified: 2022-03-23T17:41:31.338Z
*/
import { ValueParsers, GetParser} from './value-parser'
import { MetadataArgument, mArguments, getMetadata } from './metadata'
import { ARGUMENT_ERROR, MCError } from '../@utils/mce-error'

export class Argument {
	static Get(target: unknown): Argument[] {
		return getMetadata(mArguments, target) || []
	}
	name: string
	defaults: unknown
	oKind: string
	kind: Array<ValueParsers>
	rest: boolean
	required: boolean
	constructor(option: MetadataArgument, public description: string, public index) {
		this.name = option.property
		this.oKind = option.kind
		let [_, k1, k2] = option.kind.match(/(.*)<(.*)>/) || [null, option.kind]
		if(option.kind.includes('[')) {
			[_, k2, k1 = 'List'] = option.kind.match(/(.*)\[\]/) || [null, option.kind]
		}
		this.kind = [k1, k2].filter(k => k).map(k => k.toLowerCase()) as Array<ValueParsers>
		this.defaults = option.defaults || (option.rest ? [] : undefined)
		this.required = !this.defaults
		this.rest = option.rest
	}
	parseValue(value: string) {
		const [first, second] = this.kind
		const parser1 = GetParser(first) || (str => str)
		const parser2 = GetParser(second) || (str => str)
		let result: unknown = parser1(value || this.defaults as string)
		if(result instanceof Array) {
			result = result.map(d => this.checkValue(parser2(d), value)) as unknown
		}
		this.checkValue(result, value)
		return result
	}
	match(args: string[]) {
		if(this.rest) {
			return this.parseValue(args.join(', '))
		}
		return this.parseValue( args.shift() )
	}
	private checkValue(result: unknown, value: unknown ) {
		if(!result && !this.rest) {
			if(this.required) {
				throw new MCError(ARGUMENT_ERROR, `Argument {${this.name}|green} is required`)
			} else {
				throw new MCError(ARGUMENT_ERROR, `Value '${value}' does not matches ${this.oKind} for argument ${this.name}`)
			}
		}
		return result
	}
}