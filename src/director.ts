/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: mce-cli-2.ts
Created:  2022-01-31T07:37:27.395Z
Modified: 2022-03-14T18:17:11.744Z
*/
import { ExecuterDirector } from './executer'

type SingleCommand = {
	root: string
	argv: string[]
	single: true
}

type GitStyle = {
	root: string
	argv: string[]
	locals?: boolean
	plugins?: string
}
export function Program(data: GitStyle): Promise<void>
export function Program(data: SingleCommand): Promise<void>
export async function Program(data: any) {
	process.env.MCE_ROOT = data.root
	await ExecuterDirector(!data.single)
}
