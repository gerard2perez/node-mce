/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: option.ts
Created:  2022-01-30T04:10:54.411Z
Modified: 2022-01-30T23:08:36.307Z
*/

import { Insert, mceData, mOptions } from '../metadata'
import { Option } from '../option'

export function opt(description: string): ParameterDecorator
export function opt(short: string): ParameterDecorator
export function opt(short: string, description: string): ParameterDecorator
export function opt(target: unknown, propertyKey: string, parameterIndex: number): void
export function opt(...args: unknown[]): ParameterDecorator | void {
	function ParameterDecorator(target: unknown, propertyKey: string, parameterIndex: number) {
		let short: string
		let description: string
		const [arg0='', arg1=''] = args
		if(typeof arg0 === 'string') {
			if(!arg1 && arg0.length > 1) {
				description = arg0
			} else {
				short = `-${arg0}`
				description = arg1 as string
			}
		}
		if(short && short.length>2) {
			throw new Error('Short Tag must be only one character')
		}
		const data = mceData(target, propertyKey)[parameterIndex]
		const option = new Option(data, description, short, parameterIndex )
		Insert(mOptions, option, target)
	}
	switch(args.length) {
		case 3:
			ParameterDecorator(args[0], args[1] as string, args[2] as number)
			break
		default:
			return ParameterDecorator
	}
}