/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: option.ts
Created:  2022-01-30T04:10:54.411Z
Modified: 2022-03-24T05:34:03.523Z
*/

import { WrapDecorator } from '../../@utils/decorator'
import { Command } from '../../core/command'
import { Insert, metaOption, mOptions } from '../metadata'
import { Option } from '../options/option'

function OptionDecorator(target: unknown, propertyKey: string, ...args: string[]) {
	let short: string
	let description: string
	const [arg0, arg1=''] = args
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
	if(typeof metadata.kind === 'string' && metadata.kind.toLowerCase() === 'verbosity') {
		short = '-v'
	}
	const option = new Option(metadata, description, short )
	Insert(mOptions, option, target)
}

type ov1 = (description: string) => PropertyDecorator
type ov2 = (short: string, description: string) => PropertyDecorator
type ov3 = (target: unknown, propertyKey: string| symbol ) => void
type OptionDecorato2r = ov1 & ov2 & ov3
export const opt: OptionDecorato2r  = WrapDecorator(target => target instanceof Command, OptionDecorator)