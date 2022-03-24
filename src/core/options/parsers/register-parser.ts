/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: register-parser.ts
Created:  2022-03-23T21:42:00.657Z
Modified: 2022-03-24T07:50:10.355Z
*/
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

const stringParser = str => str
const booleanTagParser = tag => [`--${tag}`]
const namedTagParser = tag => [`--${tag}`, `<${tag}>`]
function defaultParser(tag) { return tag ? `${tag}` : '' }

const ValueParsers = {
	string: stringParser,
	collection: collectionParser,
	list: collectionParser,
	int: (str: string) => parseInt(str) || undefined,
	number: (str: string) => parseFloat(str) || undefined,
	float: (str: string) => parseFloat(str) || undefined,
	boolean: (str: string) => str == 'true'
}
const helpTagsParser = {
	boolean: booleanTagParser
}
const helpDefaultsParser = {
	boolean: val => val
}

type CorceKind = typeof ValueParsers
type Coerce<T = CorceKind> = {
	[k in keyof T]: T[k]
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Parsers extends MCE.ValueParsers, Coerce {
	
}
export type ValueParsers = keyof Parsers | `List<${keyof Parsers}>`
type ParserFunction = (str: string, extra?: unknown) => unknown
type TagParser = (tag: string) => [string, string?]

export function RegisterClassParser(constructor: new () => unknown) {
	const name = constructor.name.replace('Parser', '').toLowerCase()
	Add(name, ValueParsers, constructor.prototype.parseValue)
	Add(name, helpTagsParser, constructor.prototype.helpLongTag)
	Add(name, helpDefaultsParser, constructor.prototype.helpDefaults)
}
function Add(name: string, collection: any, parser: ParserFunction) {
	name = name.toLocaleLowerCase()
	if(collection[name]) {
		throw new Error(`Parser ${name}, already exists`)
	} else {
		collection[name] = parser
	}
}

export function GetParser(name: string): ParserFunction {
	return ValueParsers[name] || stringParser
}
export function GetTagParser(name: string): TagParser {
	return helpTagsParser[name] || namedTagParser
}
export function GetDefaultParser(name: string): ParserFunction {
	return helpDefaultsParser[name] || defaultParser
}