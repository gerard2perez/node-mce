/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: alias.ts
Created:  2022-01-30T04:13:53.023Z
Modified: 2022-01-30T21:34:54.656Z
*/

import { mAlias } from '../metadata'

/**
 * Allow to call the parameter by the use of a shortchut alias
 * @param alias Single character
 * @returns 
 */
export function alias(alias: string) {
	return Reflect.metadata(mAlias, alias)
}
