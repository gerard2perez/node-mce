/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: dry-run.ts
Created:  2022-03-25T18:02:48.691Z
Modified: 2022-03-27T07:32:46.398Z
*/

import { IValueParser, ITagParser, RegisterClassParser } from '../parser'
import { BooleanParser } from './boolean'
@RegisterClassParser({
	tagHasValue: false, 
	description: 'Executes the program without touching the disc or calling shell scripts'
 })
export class DryRunParser extends BooleanParser implements ITagParser, IValueParser<unknown> {
	helpDefaults(..._values: unknown[]): string {
		return ''
	}
}
export type DryRun = boolean