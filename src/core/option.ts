/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: option.ts
Created:  2022-01-30T04:03:09.903Z
Modified: 2022-04-18T21:24:24.312Z
*/
import { MCError, MISSING_VALUE_OPTION } from '../@utils/mce-error'
import 'reflect-metadata'
import { mOptions, getMetadata, MetadataOption } from './metadata'
import { DefaultDescription, GetDefaultParser, GetParser, GetTagParser, ParserHasValue, ValueParsers, GetParserChain, ParserFunction } from './parser'
export class Option {
	static Get(target: unknown): Option[] {
		return getMetadata(mOptions, target) || []
	}
	name: string
	tag: string
	defaults: unknown
	private kind: Array<ValueParsers>
	private metaKind: ValueParsers | Record<string, unknown>
	private baseType: string
	parserChain: ParserFunction
	hasValue: boolean
	private allowMulti: boolean
	constructor(metadata: MetadataOption, public description: string, public short: string) {
		this.name = metadata.property
		this.tag = '--' + this.name.replace(/([A-Z])/gm, '-$1').toLowerCase()
		this.metaKind = metadata.kind
		this.allowMulti = metadata.allowMulti
		if(typeof metadata.kind === 'string') {
			let _list: boolean, _repeat: boolean
			[this.baseType, this.parserChain, _list, _repeat] = GetParserChain(metadata.kind, this.checkValue.bind(this))
			this.allowMulti = _list || _repeat
			this.defaults =  metadata.defaults || (this.baseType === 'boolean' ? false : metadata.defaults)
			this.hasValue =  ParserHasValue(this.baseType)
		} else {
			this.baseType = 'enum'
			this.parserChain = GetParser('enum')
			this.kind = ['enum']
			this.hasValue = true
			this.allowMulti = false
			this.defaults = this.parserChain(metadata.defaults as string, this.metaKind)
		}
		if(!this.description) {
			this.description = DefaultDescription(this.baseType)
		}
	}
	parseHelpDefaults() {
		return GetDefaultParser(this.baseType)(this.defaults as string, this.metaKind)
	}
	parseHelpTag() {
		return GetTagParser(this.baseType)(this.tag, this.name)
	}
	parseValue(value: string) {
		return this.parserChain(value, this.metaKind)
	}
	match<T = unknown>(args: string[]) {
		const results = []
		for(let i=0; i<args.length; i++) {
			const tag = args[i]
			if(!tag.startsWith('-'))continue
			if(tag ===this.tag || tag === this.short) {
				results.push(tag)
			} else if(tag && this.decompressTags(tag, i, args) ) {
				results.push(args[i])
			}
		}
		if(results.length > 1 && !this.allowMulti) {
			throw Error(`Options ${this.tag}|${this.short} can only be prensnet once`)
		}
		const values = [] as string[]
		for(let i = 0; i < results.length; i++) {
			const index = args.indexOf(results[i])
			if( this.hasValue ) {
				const [_, value] = args.splice(index, 2)
				if(!value || value.startsWith('-') /*&& this.defaults === undefined*/) {
					throw new MCError(MISSING_VALUE_OPTION, `Missing value for option: ${this.name}`)
				}
				values.push(value)
			} else {
				args.splice(index, 1)
				values.push('true')
			}
		}
		const complete = values.join(',')
		return this.parseValue(complete || this.defaults as string) as T
	}
	private decompressTags(tag: string, index: number, tags: string[]) {
		if(!this.short || !tag.includes('-') || tag.includes('--')) return false
		const expp = new RegExp(`(${this.short[1]})`, 'g')
		const found  = tag.match(expp) || []
		for(let i = 0; i < found.length; i ++) {
			tag = tag.replace(this.short[1], '')
			if(tag !== '-') {
				tags.splice(index, 1, tag)
			} else {
				tags.splice(index, 1)
			}
			if(!this.hasValue) {
				tags.splice(index, 0, this.short)
				index++
			} else {
				const [value] = tags.splice(index + 1, 1)
				tags.splice(index, 0, this.short)
				tags.splice(index+1, 0, value)
				index+=2
			}
		}
		return found.length>0
	}
	private checkValue(result: unknown, value: unknown ) {
		if(!result) {
			throw new Error(`Value '${value}' does not matches ${this.metaKind} for option ${this.name}`)
		}
		return result
	}
}
export type Options<T> = Pick<T, {
	[P in keyof T]: T[P] extends ((...args: unknown[]) => unknown) ? never : P
}[keyof T]>