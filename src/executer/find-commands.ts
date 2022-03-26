/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: find-commands.ts
Created:  2022-03-26T04:46:10.462Z
Modified: 2022-03-26T04:46:36.672Z
*/
import { basename, join } from 'path'
import { readdirSync } from '../mockable/fs'
import { pathMapping } from './path-mapper'
export function findCommands(path: string, prefix = '') {
	const res = readdirSync(path).filter(p => !p.endsWith('.map') && !p.endsWith('.d.ts')).map(p => p.replace('.js', '').replace('.ts', ''))
	for(const filePath of res) {
		pathMapping.set(prefix+basename(filePath), join(path, filePath))
	}
}