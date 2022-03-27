/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: tag-parser.ts
Created:  2022-03-23T21:35:12.880Z
Modified: 2022-03-27T02:18:46.472Z
*/

export interface ITagParser {
	helpLongTag(tag: string, name?: string): [tag:string, param: string]
	helpDefaults(...values: unknown[]): string
}