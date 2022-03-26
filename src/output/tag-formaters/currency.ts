/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: currency.ts
Created:  2022-03-17T05:37:49.608Z
Modified: 2022-03-26T04:10:59.603Z
*/

import { cleanColor } from '../clean-color'
import { RegisterLogFormater } from './register-log-formater'

RegisterLogFormater( (number_like: string, currency = 'MXN') => {
	const formatter = new Intl.NumberFormat('es', {
		style: 'currency',
		currency: currency.toUpperCase(),
	})
	const float = parseFloat(cleanColor(number_like.toString())) || 0
	return number_like.replace(float.toString(), formatter.format(float))
}, 'currency')