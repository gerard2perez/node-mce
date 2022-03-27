/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: argument.ts
Created:  2022-01-30T03:32:50.703Z
Modified: 2022-03-27T09:13:44.275Z
*/
import { MetadataArgument, mArguments, getMetadata } from './metadata'
import { ARGUMENT_ERROR, ARGUMENT_TYPE_MISSMATCH, MCError } from '../@utils/mce-error'
import { GetParserChain, ParserFunction, ValueParsers } from './parser'

export class Argument {
	static Get(target: unknown): Argument[] {
		return getMetadata(mArguments, target) || []
	}
	name: string
	defaults: unknown
	parserChain: ParserFunction
	oKind: string
	private metaKind: ValueParsers | Record<string, unknown>
	rest: boolean
	required: boolean
	private baseKind: string
	constructor(metadata: MetadataArgument, public description: string, public index) {
		this.name = metadata.property
		this.oKind = metadata.kind
		this.rest = metadata.rest
		let _a, _b
		[this.baseKind, this.parserChain, _a, _b] = GetParserChain(metadata.kind, this.checkValue.bind(this))
		this.defaults = metadata.defaults || (metadata.rest ? [] : undefined)
		this.required = !this.defaults
		
	}
	parseValue(value: string) {
		return this.checkValue(this.parserChain(value || this.defaults as any, this.metaKind), value)
	}
	match(args: string[]) {
		if(this.rest) {
			return this.parseValue(args.splice(0).join(', '))
		}
		return this.parseValue( args.shift() )
	}
	private checkValue(result: unknown, value: unknown ) {
		if(value && result === undefined) {
			throw new MCError(ARGUMENT_TYPE_MISSMATCH, 'Argument type missmatch')
		}
		if(result === undefined && !this.rest) {
			if(this.required) {
				throw new MCError(ARGUMENT_ERROR, `Argument ${this.name} is required`)
			} else {
				throw new MCError(ARGUMENT_ERROR, `Value '${value}' does not matches ${this.oKind} for argument ${this.name}`)
			}
		}
		return result
	}
}

