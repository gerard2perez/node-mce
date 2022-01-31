/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: description.ts
Created:  2022-01-30T04:13:28.572Z
Modified: 2022-01-30T21:16:43.032Z
*/

import { mDescription } from '..'

/**
 * Description that is printen with the help command
 * @param description 
 * @returns 
 */
export function description(description: `${string}`) {
	return Reflect.metadata(mDescription, description)
}
