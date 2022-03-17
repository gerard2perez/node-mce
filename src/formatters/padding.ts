/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: padding.ts
Created:  2022-03-17T05:36:59.164Z
Modified: 2022-03-17T05:41:44.558Z
*/

import { cleanColor } from './colors'
import { RegisterLogFormatter } from './string-formatters'

RegisterLogFormatter( (text: string, _spaces = '0', sym = ' ') => {
	const spaces = parseInt(_spaces)
	const colorsLenght = text.length - cleanColor(text).length
    return text.padStart(spaces + colorsLenght, sym)
 }, 'padl')
 RegisterLogFormatter( (text: string,  _spaces = '0', sym = ' ') => {
	const spaces = parseInt(_spaces)
	const colorsLenght = text.length - cleanColor(text).length
    return text.padEnd(spaces + colorsLenght, sym)
  }, 'padr')