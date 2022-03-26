/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: register-log-formater.ts
Created:  2022-03-17T05:33:14.234Z
Modified: 2022-03-26T03:14:01.676Z
*/

type FormatterFn = (text: string, ...args: any[]) => string
const Formatters = new Map<string, FormatterFn>()
export function RegisterLogFormater(fn: FormatterFn, name?: string) {
	Formatters.set(name || fn.name, fn)
}
export function GetLogFormater(formatter: string) {
	return Formatters.get(formatter)
}