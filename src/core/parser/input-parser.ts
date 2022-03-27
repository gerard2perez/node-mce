/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: input-parser.ts
Created:  2022-03-27T01:34:50.252Z
Modified: 2022-03-27T01:41:42.624Z
*/

export interface IValueParser<T> {
	parseValue(value: T | string, ...extra: unknown[]): T
}