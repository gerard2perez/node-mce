/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: theme.ts
Created:  2022-01-31T06:35:35.132Z
Modified: 2022-03-14T22:22:40.874Z
*/

import { HelpTheme } from '../core'

export const DefaultTheme: HelpTheme = {
	description: {
		primary: ['white'],
		secondary: ['gray']
	},
	command: ['yellow'],
	argument: {
		primary: ['green'],
		secondary: ['gray']
	},
	option: {
		primary: ['cyan'],
		secondary: ['gray']
	}
}