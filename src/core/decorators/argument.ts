/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: decorators.ts
Created:  2022-01-30T04:02:49.207Z
Modified: 2022-03-14T18:32:48.343Z
*/

import { Argument } from '../argument'
import { Insert, metaArguments, mArguments } from '../metadata'

export function arg(description: string): ParameterDecorator
export function arg(target: unknown, propertyKey: string, parameterIndex: number): void
export function arg(...args: Array<unknown|string|number>): ParameterDecorator | void {
	function ParameterDecorator(target: unknown, propertyKey: string, parameterIndex: number) {
		const [description] = args as string[]
		const data = metaArguments(target, propertyKey)[parameterIndex]
		Insert(mArguments, new Argument(data, description, parameterIndex ), target)
	}
	switch(args.length) {
		case 3:
			ParameterDecorator(args[0], args[1] as string, args[2] as number)
			break
		default:
			return ParameterDecorator
	}
	
}