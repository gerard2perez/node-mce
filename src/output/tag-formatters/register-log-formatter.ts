/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: register-log-formatter.ts
Created:  2022-03-17T05:33:14.234Z
Modified: 2022-05-10T20:35:50.899Z
*/

type FormatterFn = (text: string, ...args: any[]) => string
const Formatters = new Map<string, FormatterFn>()
export function RegisterLogFormatter(fn: FormatterFn, name?: string) {
	Formatters.set(name || fn.name, fn)
}
export function GetLogFormatter(formatter: string) {
	return Formatters.get(formatter)
}