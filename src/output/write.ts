/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: log.ts
Created:  2022-03-17T05:48:30.034Z
Modified: 2022-03-26T03:46:00.014Z
*/

import { streams } from '../system-streams'
import { tagcompiler } from './tag-compiler'
export function write(text: TemplateStringsArray, ...values: any[]) {
	streams.output.write(tagcompiler(text, ...values))
}