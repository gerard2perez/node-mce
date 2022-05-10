/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: padding.ts
Created:  2022-03-17T05:36:59.164Z
Modified: 2022-03-26T04:17:46.441Z
*/
import { cleanColor } from '../clean-color'
import { RegisterLogFormatter } from './register-log-formatter'

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