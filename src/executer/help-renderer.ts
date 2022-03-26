/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: help-renderer.ts
Created:  2022-03-26T04:49:19.374Z
Modified: 2022-03-26T04:50:26.386Z
*/

import { DefaultTheme } from '../@utils/theme'
import { DefaultHelpRenderer } from '../@utils/help.renderer'
import { pathMapping } from './path-mapper'
import { LoadModule } from '../module-loader'

export async function helpRenderer(helpRequested: boolean, requestedCMD: string, commandName: string) {
	if(helpRequested) {
		const hRenderer = new DefaultHelpRenderer(DefaultTheme)
		const commadFileNames = requestedCMD ? [[requestedCMD, pathMapping.get(requestedCMD)]] as [string, string][] : Array.from(pathMapping.entries())
		const commandCtrs = await Promise.all(commadFileNames.map(([forceName, requestedCMD]) => LoadModule(requestedCMD, forceName)))
		hRenderer.render(commandName, commandCtrs.map(b => new b()), commadFileNames.length > 1)
		return true
	}
	return false
}