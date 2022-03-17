/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: autowrap.ts
Created:  2022-03-17T05:38:39.225Z
Modified: 2022-03-17T05:41:35.543Z
*/

import { streams } from '../system-streams'
import { RegisterLogFormatter } from './string-formatters'

const wordWrap = (size: number) => new RegExp(`([^\\n]{1,${size}})(\\s|$)`, 'g')


 RegisterLogFormatter((text = '', start=0) => {
	const [width] = streams.output.getWindowSize()
	const size =  width-start	
	let result = (text||'').match(wordWrap(size)) as string[] || [text]
	result = result.map( (line, i) => {
		line = line.trim()
		const spacesNeeded = size - line.length
		const shoulfFill =  i !== result.length - 1
		const currentSpaces = (line.match(/\w\b/g)||[]).length - 1
		if(shoulfFill && spacesNeeded > 0 && currentSpaces > 0) {
			const insertNSpaces = Math.floor(spacesNeeded / currentSpaces)
			const leftSpaces = spacesNeeded % currentSpaces
			line = line.split(' ')
				.map((word, i) => word + ''.padEnd(insertNSpaces+(i<leftSpaces?1:0), ' '))
				.join(' ').trimEnd()
		}
		return line
	}) as string[]
	return result ? result.map( (l, i) => (i ? ''.padStart(start, ' ') : '') + l).join('\r\n') : text.padStart(start, ' ')
 }, 'autowrap')