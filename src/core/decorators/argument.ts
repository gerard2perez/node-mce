/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: decorators.ts
Created:  2022-01-30T04:02:49.207Z
Modified: 2022-03-24T03:25:39.792Z
*/

import { Command } from '../../core/command'
import { WrapDecorator } from '../../@utils/decorator'
import { Argument } from '../argument'
import { Insert, metaArguments, mArguments } from '../metadata'

function ParameterDecorator(target: unknown, propertyKey: string, parameterIndex: number, description: string = undefined) {
	const data = metaArguments(target, propertyKey)[parameterIndex]
	Insert(mArguments, new Argument(data, description, parameterIndex ), target)
}

type ov1 = (description: string) => ParameterDecorator
type ov3 = (target: unknown, propertyKey: string, parameterIndex: number) => void
type ArgumentDecorator = ov1 & ov3
export const arg: ArgumentDecorator  = WrapDecorator(target => target instanceof Command, ParameterDecorator)
