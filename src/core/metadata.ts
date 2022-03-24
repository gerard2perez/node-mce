/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: metatdata.ts
Created:  2022-01-30T03:55:36.567Z
Modified: 2022-03-23T21:58:54.955Z
*/

import { ValueParsers } from './options'

export interface MetadataArgument {
	property: string
	kind: ValueParsers
	optional: boolean
	rest: boolean
	defaults: unknown
}
export interface MetadataOption {
	property: string
	kind: ValueParsers
	defaults: unknown
	allowMulti?: boolean
}

export function metaArguments(target: unknown, fn: string) {
	return Reflect.getMetadata('mce:data', target, fn) as Array<MetadataArgument>
}
export function metaOption(target: unknown, property: string) {
	return Reflect.getMetadata('mce:data', target, property) as MetadataOption
}
export function Insert(metadataKey: symbol, value: unknown & {index?: number, name: string}, target: unknown) {
	let data: (unknown & {index?: number})[] = Reflect.getMetadata(metadataKey, target) || []
	data.push(value)
	if(value.index != undefined) {
		data = data.sort( (a, b) => a.index - b.index)
	}
	Reflect.defineMetadata(metadataKey, data, target)
}

export function getMetadata<T>(metadataKey: symbol, target: unknown): T {
	if( [mAlias, mDescription].includes(metadataKey) ) {
		return Reflect.getMetadata(metadataKey, target.constructor)
	} else {
		return Reflect.getMetadata(metadataKey, target)
	}
}
export const mAlias = Symbol('mce:alias')
export const mDescription = Symbol('mce:description')
export const mArguments = Symbol('mce:arguments')
export const mOptions = Symbol('mce:options')
