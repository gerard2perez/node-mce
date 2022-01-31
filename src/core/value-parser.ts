/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: value-parser.ts
Created:  2022-01-30T03:33:15.897Z
Modified: 2022-01-30T22:50:19.781Z
*/
declare global {
	namespace MCE {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface ValueParsers {
			
		}
	}
}
const ValueParsers = {
	int: (str: string) => parseInt(str),
	number: (str: string) => parseInt(str),
	float: (str: string) => parseFloat(str),
	range: (str: string) => str.split('-').map(n => parseFloat(str)),
	collection: (str: string) => str.split(','),
	list: (str: string) => str.split(','),
	boolean: (str: string) => str === 'true'
}
type CorceKind = typeof ValueParsers
type Coerce<T = CorceKind> = {
	[k in keyof T]: T[k]
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Parsers extends MCE.ValueParsers, Coerce {
	
}
export type ValueParsers = keyof Parsers
type ValueParser = (str: string) => unknown

export function RegisterParser(name: string, parser: ValueParser) {
	if(ValueParsers[name]) {
		throw new Error(`Parser ${name}, already exists`)
	} else {
		ValueParsers[name] = parser
	}
}
export function GetParser(name: string) {
	return ValueParsers[name]
}