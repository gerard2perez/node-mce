/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: option.ts
Created:  2022-01-30T04:10:54.411Z
Modified: 2022-03-15T01:06:32.651Z
*/

import { Insert, metaOption, mOptions } from '../metadata'
import { Option } from '../option'

export function opt(description: string): PropertyDecorator
export function opt(short: string): PropertyDecorator
export function opt(short: string, description: string): PropertyDecorator
export function opt(target: unknown, propertyKey: string| symbol ): void
export function opt(...args: unknown[]): PropertyDecorator | void {
	function PropertyDecorator(target: unknown, propertyKey: string) {
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
		const metadata = metaOption(target, propertyKey)
		const option = new Option(metadata, description, short )
		Insert(mOptions, option, target)
	}
	return PropertyDecorator
}