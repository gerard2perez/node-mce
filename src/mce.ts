/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: mce-cli-2.ts
Created:  2022-01-31T07:37:27.395Z
Modified: 2022-01-31T07:40:32.313Z
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
function MCE(data: GitStyle): Promise<void>
function MCE(data: SingleCommand): Promise<void>
async function MCE(data: any) {
	process.env.MCE_ROOT = data.root
	await ExecuterDirector(!data.single)
}

MCE({
	root: __dirname,
	argv: process.argv,
	plugins: 'mce',
	locals: false
})