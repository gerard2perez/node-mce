/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: director.ts
Created:  2022-01-31T07:37:27.395Z
Modified: 2022-03-23T00:09:11.140Z
*/
import { ExecuterDirector } from './executer'

type SingleCommand = {
	// root: string
	single: true
}

type GitStyle = {
	// root: string
	locals?: boolean
	plugins?: string
}

export class Program {
	constructor(root: string) {
		process.env.MCE_ROOT = root
	}
	async execute<T=unknown>(argv: string[], data: GitStyle): Promise<T>
	async execute<T=unknown>(argv: string[], data: SingleCommand): Promise<T>
	async execute<T=unknown>(argv: string[], _data: any) {
		return await ExecuterDirector(argv) as T
	}
}