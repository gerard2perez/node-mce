/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: currency.ts
Created:  2022-03-17T05:37:49.608Z
Modified: 2022-05-10T20:44:37.040Z
*/

import { cleanColor } from '../clean-color'
import { RegisterLogFormatter } from './register-log-formatter'

RegisterLogFormatter( (number_like: string, currency = 'MXN', locale = 'es') => {
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency.toUpperCase(),
	})
	const float = parseFloat(cleanColor(number_like.toString())) || 0
	return number_like.replace(float.toString(), formatter.format(float))
}, 'currency')