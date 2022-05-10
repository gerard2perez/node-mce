/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: common.ts
Created:  2022-03-17T05:48:01.985Z
Modified: 2022-03-26T03:51:27.004Z
*/

import { tagCompiler, tagReducer } from '../tag-compiler'
import { print } from '../print'
import { verbosity } from './verbosity'

export function info(text: TemplateStringsArray, ...values: any[]) {
	verbosity(2)`{info|sy|cyan} ${tagCompiler(text, ...values)}`
}
export function warn(text: TemplateStringsArray, ...values: any[]) {
	verbosity(1)`{warning|sy|yellow} ${tagCompiler(text, ...values)}`
}
export function error(text: TemplateStringsArray, ...values: any[]) {
	print`{error|sy|red} ${tagReducer(text, ...values)}`
}
export function ok(text: TemplateStringsArray, ...values: any[]) {
	print`{success|sy|green} ${tagReducer(text, ...values)}`
}
export function updated(text: TemplateStringsArray, ...values: any[]) {
	print`{updated|sy|blueBright} ${tagReducer(text, ...values)}`
}
export function created(text: TemplateStringsArray, ...values: any[]) {
	
	print`{success|sy|blueBright} ${tagReducer(text, values)}`
}