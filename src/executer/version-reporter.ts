/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: version-reporter.ts
Created:  2022-03-26T04:53:44.319Z
Modified: 2022-03-26T04:59:31.697Z
*/
import { cliPath } from '..'
import { Option, print } from '../core'
export async function versionReporter(preArguments: string[]) {
	const version = new Option({kind: 'boolean', defaults: false, property: 'version'}, '', '')
	if(version.match(preArguments)) {
		const pack = await import(cliPath('package.json').replace('src', '').replace('dist', ''))
		print`${pack.version}`
		return pack.version
	}
	return undefined
}