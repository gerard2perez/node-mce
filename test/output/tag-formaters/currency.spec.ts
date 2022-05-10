/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: currency.spec.ts
Created:  2022-05-10T20:25:29.715Z
Modified: 2022-05-10T20:48:00.493Z
*/
import { output } from '@gerard2p/mce/test'
import { write } from '@gerard2p/mce'
import '@gerard2p/mce/output/tag-formatters/currency'

test('Currency tag formatter', () => {
	output.clear()
	write`{100|currency}`
	expect(output.content).toBe('100,00 MXN')
})