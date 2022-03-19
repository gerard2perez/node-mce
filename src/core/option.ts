/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: option.ts
Created:  2022-01-30T04:03:09.903Z
Modified: 2022-03-19T02:37:53.128Z
*/
import 'reflect-metadata'
import { mOptions, getMetadata, MetadataOption } from './metadata'
import { GetParser, ValueParsers } from './value-parser'
//TODO: I don't like way verbosity is parsed maybe I need options to configure this kind of data
export class Option {
	static Get(target: unknown): Option[] {
		return getMetadata(mOptions, target) || []
	}
	name: string
	tag: string
	defaults: unknown
	kind: Array<ValueParsers>
	private oKind: string
	hasValue: boolean
	private allowMulti: boolean
	constructor(option: MetadataOption, public description: string, public short: string) {
		this.name = option.property
		this.oKind = option.kind
		this.tag = '--' + this.name.replace(/([A-Z])/gm, '-$1').toLowerCase()
		const [_, k1, k2] = option.kind.match(/(.*)<(.*)>/) || [null, option.kind]
		this.kind = [k1, k2].filter(k => k).map(k => k.toLowerCase()) as Array<ValueParsers>
		this.defaults = option.defaults
		this.hasValue = k1 !== 'boolean' && k1 !== 'verbosity'
		this.allowMulti = option.allowMulti
	}

	parseValue(value: string) {
		const [first, second] = this.kind
		const parser1 = GetParser(first) || (str => str)
		const parser2 = GetParser(second) || (str => str)
		
		let result: unknown = parser1(value)
		if(result instanceof Array) {
			result = result.map(d => this.checkValue(parser2(d), value)) as unknown
		}
		
		return (first === 'boolean' ? false : undefined) || result
	}
	match<T = unknown>(args: string[]) {
		const results = [...args.filter(t => t===this.tag), ...args.filter(t => t===this.short)]
		
		if(this.kind.length===1 && results.length > 1 && !this.allowMulti) {
			throw Error(`Options ${this.tag}|${this.short} can only be prensnet once`)
		}
		const values = [] as string[]
		for(let i = 0; i< results.length; i++) {
			const index = args.indexOf(results[i])
			if( this.hasValue ) {
				const [_, value] = args.splice(index, 2)
				values.push(value)
			} else {
				args.splice(index, 1)
				values.push('true')
			}
		}
		const complete = values.join(',')
		return this.parseValue(complete || this.defaults as string) as T
	}
	private checkValue(result: unknown, value: unknown ) {
		if(!result) {
			throw new Error(`Value '${value}' does not matches ${this.oKind} for option ${this.name}`)
		}
		return result
	}
}