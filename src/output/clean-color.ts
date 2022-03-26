/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: clean-color.ts
Created:  2022-03-26T04:09:14.227Z
Modified: 2022-03-26T04:10:54.031Z
*/

const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|')
const expression = new RegExp(pattern, 'g')
export function cleanColor( input: string): string {
	return typeof input === 'string' ? input.replace(expression, '') : input
}