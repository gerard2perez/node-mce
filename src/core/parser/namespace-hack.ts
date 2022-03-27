/* eslint-disable @typescript-eslint/no-empty-interface */
/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: namespace-hack.ts
Created:  2022-03-27T01:48:00.079Z
Modified: 2022-03-27T09:03:14.404Z
*/

declare global {
	namespace MCE {
		interface ValueParsers {
			string()
			number()
		}
		interface ListValueParsers {
			string()
			number()
		}
	}
}
// type CorceKind = typeof ValueParsers
// type Coerce<T = CorceKind> = { [k in keyof T]: T[k] }
interface SingleValueParsers extends MCE.ValueParsers {}
interface ListParsers extends MCE.ListValueParsers {}
export type ValueParseChain = (value: unknown, ...extras: unknown[]) => unknown
export type ValueParsers = keyof SingleValueParsers | `List<${keyof ListParsers}>` | `Collection<${keyof ListParsers}>`