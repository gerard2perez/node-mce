/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: argument-parser.ts
Created:  2022-03-27T00:53:12.356Z
Modified: 2022-01-31T06:13:44.895Z
*/

export interface IArgumentParser<T> {
	arrayParser(value: string|T, ...values: unknown[]): T
}