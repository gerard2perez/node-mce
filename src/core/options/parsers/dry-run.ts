/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: dry-run.ts
Created:  2022-03-25T18:02:48.691Z
Modified: 2022-03-25T18:36:42.922Z
*/

import { IOptionParser } from './option-parser'
import { booleanParser, RegisterClassParser } from './register-parser'
@RegisterClassParser({ simple: true })
export class DryRunParser extends IOptionParser {
	parseValue(...values: unknown[]): unknown {
		return booleanParser(values[0] as string)
	}
	static defaultDescription = 'Executes the program without touching the disc or calling shell scripts'
	helpLongTag(tag: string): [tag: string, param: string] {
		return [tag, '']
	}
	helpDefaults(...values: unknown[]): string {
		return ''
	}
}
export type DryRun = boolean