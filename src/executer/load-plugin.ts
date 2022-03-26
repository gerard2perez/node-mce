/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: load-plugin.ts
Created:  2022-03-26T04:46:53.261Z
Modified: 2022-03-26T04:47:30.551Z
*/

import { PackageJSON } from '../@utils/package-json'
import { cliPath, callerPath } from '../fs'
import { findCommands } from './find-commands'

export function LoadPlugins(keyword: string) {
	try {
		const {dependencies, devDependencies} = new PackageJSON(cliPath('package.json').replace('src', '').replace('dist', ''))
		const packages = Object.keys({...dependencies, ...devDependencies})
		for(let i=0; i< packages.length; i++) {
			const { keywords = [] } = new PackageJSON(callerPath('node_modules', packages[i], 'package.json'))
			if(keywords.includes(keyword)) {
				const commandsPath = callerPath('node_modules', packages[i], '@commands')
				findCommands(commandsPath, packages[i]+':')
			}
		}
	} catch (_err) {
		void 0
	}
}