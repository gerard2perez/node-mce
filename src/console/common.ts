/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: common.ts
Created:  2022-03-17T05:48:01.985Z
Modified: 2022-03-23T01:06:01.941Z
*/

import { tagcompiler } from './tag-compiler'
import { verbosity } from '../console'

export function info(text: TemplateStringsArray, ...values: any[]) {
	verbosity(2)`{info|sy|cyan} ${tagcompiler(text, ...values)}`
}
export function warn(text: TemplateStringsArray, ...values: any[]) {
	verbosity(1)`{warning|sy|yellow} ${tagcompiler(text, ...values)}`
}
export function error(text: TemplateStringsArray, ...values: any[]) {
	verbosity(0)`{error|sy|red} ${tagcompiler(text, ...values)}`
}
export function ok(text: TemplateStringsArray, ...values: any[]) {
	verbosity(0)`{success|sy|green} ${tagcompiler(text, ...values)}`
}
export function updated(text: TemplateStringsArray, ...values: any[]) {
	verbosity(0)`{updated|sy|blueBright} ${tagcompiler(text, ...values)}`
}
export function created(text: TemplateStringsArray, ...values: any[]) {
	verbosity(0)`{success|sy|blueBright} ${tagcompiler(text, ...values)}`
}