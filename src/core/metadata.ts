/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: metatdata.ts
Created:  2022-01-30T03:55:36.567Z
Modified: 2022-01-31T06:12:41.887Z
*/

import { ValueParsers } from './value-parser'
interface IMetadata {
	alias: string
	description: string
	arguments: unknown[]
	parameters: unknown[]
}
export interface IParameter {
	property: string
	kind: ValueParsers
	optional: boolean
	rest: boolean
	defaults: unknown
}

export function mceData(target: unknown, fn: string) {
	return Reflect.getMetadata('mce:data', target, fn) as Array<IParameter>
}
export function Insert(metadataKey: symbol, value: unknown & {index: number}, target: unknown) {
	let data: (unknown & {index: number})[] = Reflect.getMetadata(metadataKey, target) || []
	data.push(value)
	data = data.sort( (a, b) => a.index - b.index)
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
