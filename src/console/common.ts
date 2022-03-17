/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: common.ts
Created:  2022-03-17T05:48:01.985Z
Modified: 2022-03-17T05:50:22.272Z
*/

import { tagcompiler } from './tag-compiler'
import { verbose } from './verbose'

export function info(text: TemplateStringsArray, ...values: any[]) {
	verbose(2)`{info|sy|cyan} ${tagcompiler(text, ...values)}`
}
export function warn(text: TemplateStringsArray, ...values: any[]) {
	verbose(1)`{warning|sy|yellow} ${tagcompiler(text, ...values)}`
}
export function error(text: TemplateStringsArray, ...values: any[]) {
	verbose(0)`{error|sy|red} ${tagcompiler(text, ...values)}`
}
export function ok(text: TemplateStringsArray, ...values: any[]) {
	verbose(0)`{success|sy|green} ${tagcompiler(text, ...values)}`
}
export function updated(text: TemplateStringsArray, ...values: any[]) {
	verbose(0)`{updated|sy|blueBright} ${tagcompiler(text, ...values)}`
}
export function created(text: TemplateStringsArray, ...values: any[]) {
	verbose(0)`{success|sy|blueBright} ${tagcompiler(text, ...values)}`
}