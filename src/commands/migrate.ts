/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: migrate.ts
Created:  2022-03-22T23:22:55.889Z
Modified: 2022-03-22T23:26:04.342Z
*/

import { Command } from '~core'


export class MigrateCommand extends Command {
	action(...args: unknown[]): Promise<void> {
		throw new Error('Method not implemented.')
	}
	
}