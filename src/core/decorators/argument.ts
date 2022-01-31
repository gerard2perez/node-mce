/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: decorators.ts
Created:  2022-01-30T04:02:49.207Z
Modified: 2022-01-31T06:13:47.701Z
*/

import { Argument } from '../argument'
import { Insert, mceData, mArguments } from '../metadata'

export function arg(description: string): ParameterDecorator
export function arg(short: string, description: string): ParameterDecorator
export function arg(target: unknown, propertyKey: string, parameterIndex: number): void
export function arg(...args: Array<unknown|string|number>): ParameterDecorator | void {
	function ParameterDecorator(target: unknown, propertyKey: string, parameterIndex: number) {
		
		let short: string
		let description: string
		const [arg0, arg1] = args
		if(typeof arg0 === 'string') {
			if(!arg1) {
				description = arg0
			} else {
				short = arg0
				description = arg1 as string
			}
		}
		const data = mceData(target, propertyKey)[parameterIndex]
		Insert(mArguments, new Argument(data, description, short, parameterIndex ), target)
	}
	switch(args.length) {
		case 3:
			ParameterDecorator(args[0], args[1] as string, args[2] as number)
			break
		default:
			return ParameterDecorator
	}
	
}