/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: register-parser.ts
Created:  2022-03-23T21:42:00.657Z
Modified: 2022-03-25T23:41:16.185Z
*/
import 'reflect-metadata'
const collectionParser = (str: string|unknown[]) => {
	if(str instanceof Array) return str
	return str ? str.replace(/^\[|\]$/gm, '').split(',') : []
}
declare global {
	namespace MCE {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface ValueParsers {
			
		}
	}
}
export function booleanParser(str: string|boolean) {
	if(typeof str === 'boolean') {
		return str
	} else {
		if(str=='true') return true
		if(str == 'false') return false
		return undefined
	}
}
const stringParser = str => str
function booleanTagParser(tag: string) {
	return [tag]
}
function namedTagParser(tag: string, name: string ): [string, string] {
	return [tag, `<${name}>`]
}
function defaultParser(tag) { return tag ? `${tag}` : '' }
const ValueParsers = {
	string: stringParser,
	collection: collectionParser,
	list: collectionParser,
	int: (str: string) => parseInt(str) || undefined,
	number: (str: string) => parseFloat(str) || undefined,
	float: (str: string) => parseFloat(str) || undefined,
	boolean: booleanParser
}
const helpTagsParser = {
	boolean: booleanTagParser
}
const helpDefaultsParser = { boolean: val => val }
const defaultDescriptions = {}
type CorceKind = typeof ValueParsers
type Coerce<T = CorceKind> = { [k in keyof T]: T[k] }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Parsers extends MCE.ValueParsers, Coerce {}
export type ValueParsers = keyof Parsers | `List<${keyof Parsers}>`
type ParserFunction = (str: string, extra?: unknown) => unknown
type TagParser = typeof namedTagParser
const TYPES = new Map<string, symbol>()
interface ParserOptions {
	/**
	 * Idicates if the option has a value (false)
	 * or if the options is a simple tag (true)
	 */
	simple?: boolean
}
export function RegisterClassParser({ simple }: ParserOptions  = {}) {
	return function(constructor: new () => unknown) {
		const name = constructor.name.replace('Parser', '').toLowerCase()
		TYPES.set(name, Symbol(name))
		Add(name, ValueParsers, constructor.prototype.parseValue)
		Add(name, helpTagsParser, constructor.prototype.helpLongTag)
		Add(name, helpDefaultsParser, constructor.prototype.helpDefaults)
		Add(name, defaultDescriptions, (constructor as any).defaultDescription)
		const KEY = TYPES.get(name)
		Reflect.defineMetadata(KEY, constructor.prototype.parseValue, RegisterClassParser, 'value')
		Reflect.defineMetadata(KEY, constructor.prototype.helpLongTag, RegisterClassParser, 'tag')
		Reflect.defineMetadata(KEY, constructor.prototype.helpDefaults, RegisterClassParser, 'default')
		Reflect.defineMetadata(KEY, (constructor as any).defaultDescription, RegisterClassParser, 'description')
		Reflect.defineMetadata(KEY, !simple, RegisterClassParser, 'hasValue')
	}
	
}
function Add(name: string, collection: any, parser: ParserFunction) {
	name = name.toLocaleLowerCase()
	if(collection[name]) {
		throw new Error(`Parser ${name}, already exists`)
	} else {
		collection[name] = parser
	}
}
export function ParserHasValue(name: string) {
	return Reflect.getMetadata(TYPES.get(name), RegisterClassParser, 'hasValue')
}
export function GetParser(name: string): ParserFunction {
	return Reflect.getMetadata(TYPES.get(name), RegisterClassParser, 'value') || ValueParsers[name] || stringParser
}
export function GetTagParser(name: string): TagParser {
	return Reflect.getMetadata(TYPES.get(name), RegisterClassParser, 'tag') || helpTagsParser[name] || namedTagParser
}
export function GetDefaultParser(name: string): ParserFunction {
	return Reflect.getMetadata(TYPES.get(name), RegisterClassParser, 'default') || helpDefaultsParser[name] || defaultParser
}
export function DefaultDescription(name: string): string {
	return Reflect.getMetadata(TYPES.get(name), RegisterClassParser, 'description') || defaultDescriptions[name.toLowerCase()]
}