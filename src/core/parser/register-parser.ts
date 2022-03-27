/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: register-parser.ts
Created:  2022-03-23T21:42:00.657Z
Modified: 2022-03-27T09:13:26.188Z
*/
import 'reflect-metadata'
import { BaseParser } from './base-parser'
export type ParserFunction = (str: string, extra?: unknown) => unknown
type TagParser = (tag: string, name: string ) => [string, string]
type ArrayParser = typeof BaseParser.prototype.arrayParser
interface ParserOptions {
	/**
	 * Idicates if the option has a value (false)
	 * or if the options is a simple tag (true)
	 */
	tagHasValue?: boolean
	description?: string
	repetableTag?: boolean
}
const ParserStorages = {
	VALUE: Symbol(),
	TAG: Symbol(),
	DEFAULT: Symbol(),
	DESCRIPTION: Symbol(),
	HAS_VALUE: Symbol(),
	ARRAY: Symbol(),
	REPEAT: Symbol()
}
type ParserStorage = keyof typeof ParserStorages
export function RegisterClassParser({ repetableTag = false, tagHasValue = false, description }: ParserOptions  = {}) {
	return function(constructor: new (...args: any[]) => any) {
		const {kind} = getType( constructor.name.replace('Parser', ''))
		AddToStore(kind, 'VALUE', constructor.prototype.parseValue)
		AddToStore(kind, 'TAG', constructor.prototype.helpLongTag)
		AddToStore(kind, 'DEFAULT', constructor.prototype.helpDefaults)
		AddToStore(kind, 'DESCRIPTION', description)
		AddToStore(kind, 'HAS_VALUE', tagHasValue)
		AddToStore(kind, 'ARRAY', constructor.prototype.arrayParser)
		AddToStore(kind, 'REPEAT', repetableTag)
	}
	
}
function AddToStore(type: string, STORAGE: ParserStorage, value: unknown) {
	if( Reflect.hasMetadata(type, RegisterClassParser, ParserStorages[STORAGE]) ) {
		throw new Error(`Parser ${type}, already exists`)
	}
	Reflect.defineMetadata(type, value, RegisterClassParser, ParserStorages[STORAGE])
}

function GetParserOfKey(type: string, storage: ParserStorage) {
	return Reflect.getMetadata(type, RegisterClassParser, ParserStorages[storage])
}
export function ParserHasValue(name: string): boolean {
	const value = GetParserOfKey(name, 'HAS_VALUE')
	return  value === undefined ? true : value
}
export function GetParser(name: string): ParserFunction {
	return GetParserOfKey(name, 'VALUE') || BaseParser.prototype.parseValue
}
export function GetTagParser(name: string): TagParser {
	return GetParserOfKey(name, 'TAG') || BaseParser.prototype.helpLongTag
}
export function GetDefaultParser(name: string): ParserFunction {
	return GetParserOfKey(name, 'DEFAULT') || BaseParser.prototype.helpDefaults
}
export function DefaultDescription(name: string): string {
	return GetParserOfKey(name, 'DESCRIPTION')
}
export function arrayParser(name: string): ArrayParser {
	return GetParserOfKey(name, 'ARRAY') || BaseParser.prototype.arrayParser
}
function getType(name: string) {
	const type = name.toLowerCase()
	let [isArray, _k1, kind] = type.match(/(.*)<(.*)>/) || [null, null, type]
	if(!isArray) {
		[isArray, kind, _k1] = kind.match(/(.*)\[\]/) || [null, type]
		if(isArray)_k1 = 'list'
	}
	return {
		isArray: ['collection', 'list'].includes( _k1),
		kind
	}
}
export function GetParserChain(name: string, checker = (...args: unknown[]) => args): [kind: string, parser: ParserFunction, list: boolean, repeat: boolean] {
	const {  isArray, kind } = getType(name)
	const valueParser = GetParser(kind)
	let result: ParserFunction = null
	if(isArray) {
		result = (stringInput: string, ...extra: unknown[]) => arrayParser(kind)(stringInput).map(value => checker(valueParser(value as any, ...extra), value) )
	} else {
		result = valueParser
	}
	return [
		kind,
		result,
		isArray,
		GetParserOfKey(kind, 'REPEAT')
	]
}
export type ParserChain = ReturnType<typeof GetParserChain>