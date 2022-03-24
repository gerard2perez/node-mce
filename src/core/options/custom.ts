/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: custom.ts
Created:  2022-03-23T21:35:12.880Z
Modified: 2022-03-24T03:40:50.275Z
*/

export interface IOptionParser {
	parseValue(...values: unknown[]): unknown
	helpLongTag(tag: string): [tag:string, param: string]
	helpDefaults(data: unknown): string
}