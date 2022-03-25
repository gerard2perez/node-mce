/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: option-parser.ts
Created:  2022-03-23T21:35:12.880Z
Modified: 2022-03-25T18:35:21.464Z
*/

export abstract class IOptionParser {
	/**
	 * Use this description if no custom descripion is given
	 */
	static defaultDescription = ''
	parseValue(...values: unknown[]): unknown {
		return `${values[0]}`
	}
	helpLongTag(tag: string, name?: string): [tag:string, param: string] {
		return [tag, `<${name}>`]
	}
	helpDefaults(...values: unknown[]): string {
		return values[0] as string
	}
}