/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: option.ts
Created:  2022-01-30T04:03:09.903Z
Modified: 2022-03-24T09:49:24.430Z
*/
import { MCError, MISSING_VALUE_OPTION } from '../../@utils/mce-error'
import 'reflect-metadata'
import { mOptions, getMetadata, MetadataOption } from '../metadata'
import { GetDefaultParser, GetParser, GetTagParser, ValueParsers } from './parsers'

export class Option {
	static Get(target: unknown): Option[] {
		return getMetadata(mOptions, target) || []
	}
	name: string
	tag: string
	defaults: unknown
	private kind: Array<ValueParsers>
	private metaKind: ValueParsers | Record<string, unknown>
	hasValue: boolean
	private allowMulti: boolean
	constructor(option: MetadataOption, public description: string, public short: string) {
		this.name = option.property
		this.tag = '--' + this.name.replace(/([A-Z])/gm, '-$1').toLowerCase()
		this.metaKind = option.kind
		if(typeof option.kind === 'string') {
			const [_, k1, k2] = option.kind.match(/(.*)<(.*)>/) || [null, option.kind]
			this.kind = [k1, k2].filter(k => k).map(k => k.toLowerCase()) as Array<ValueParsers>
			this.defaults =  option.defaults || (k1 === 'boolean' ? false : option.defaults)
			this.hasValue = k1 !== 'boolean' && k1 !== 'verbosity'
		} else {
			this.kind = ['enum']
			this.hasValue = true
			this.defaults = GetParser('enum')(option.defaults as string, this.metaKind)
		}
		this.allowMulti = option.allowMulti
	}
	parseHelpDefaults() {
		return GetDefaultParser(this.kind[1] || this.kind[0])(this.defaults as string, this.metaKind)
	}
	parseHelpTag() {
		return GetTagParser(this.kind[1] || this.kind[0])(this.name)
	}

	parseValue(value: string) {
		const [first, second] = this.kind
		const parser1 = GetParser(first)
		let result: unknown = parser1(value, this.metaKind)
		if(result instanceof Array) {
			result = result.map(d => this.checkValue(GetParser(second)(d), value)) as unknown
		}
		
		const res = (first === 'boolean' ? false : undefined) || result
		return res
	}
	match<T = unknown>(args: string[]) {
		const results = []
		for(let i=0; i<args.length; i++) {
			const tag = args[i]
			if(tag ===this.tag || tag === this.short) {
				results.push(tag)
			} else if(tag && this.decompressTags(tag, i, args) ) {
				results.push(args[i])
			}
		}
		if(this.kind.length===1 && results.length > 1 && !this.allowMulti) {
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