/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: help.renderer.ts
Created:  2022-01-31T06:34:46.866Z
Modified: 2022-01-31T06:35:28.371Z
*/

import { HelpRenderer, HelpTheme } from '../core'

export class DefaultHelpRenderer extends HelpRenderer {
	constructor(HelpTheme: HelpTheme) {
		super(HelpTheme)
	}
}