/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: colors.ts
Created:  2022-03-17T05:33:55.174Z
Modified: 2022-03-26T04:10:03.549Z
*/
import chalk from 'chalk'
import { RegisterLogFormater } from './register-log-formater'
const Color = {
	black: 'black', red: 'red', green: 'green', yellow: 'yellow', blue: 'blue', magenta: 'magenta', cyan: 'cyan', white: 'white',
	blackBright: 'blackBright', grey: 'grey', gray: 'gray', redBright: 'redBright', greenBright: 'greenBright', yellowBright: 'yellowBright', blueBright: 'blueBright', magentaBright: 'magentaBright', cyanBright: 'cyanBright', whiteBright: 'whiteBright'
}
const Decoration = {rest: 'rest', bold: 'bold', dim: 'dim', italic: 'italic', underline: 'underline', inverse: 'inverse', hidden: 'hidden', strikethrough: 'strikethrough', visible: 'visible'}
const Background = {
	bgBlack: 'bgBlack', bgRed: 'bgRed', bgGreen: 'bgGreen', bgYellow: 'bgYellow', bgBlue: 'bgBlue', bgMagenta: 'bgMagenta', bgCyan: 'bgCyan', bgWhite: 'bgWhite', bgBlackBright: 'bgBlackBright',
	bgGray: 'bgGray', bgGrey: 'bgGrey', bgRedBright: 'bgRedBright', bgGreenBright: 'bgGreenBright', bgYellowBright: 'bgYellowBright', bgBlueBright: 'bgBlueBright', bgMagentaBright: 'bgMagentaBright', bgCyanBright: 'bgCyanBright', bgWhiteBright: 'bgWhiteBright'
}
const chalkFns = [
    ...['rest', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'visible'],
    ...['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'],
    ...['blackBright', 'grey', 'gray', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright', 'whiteBright'],
    ...['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite', 'bgBlackBright',
    'bgGray',
    'bgGrey',
    'bgRedBright',
    'bgGreenBright',
    'bgYellowBright',
    'bgBlueBright',
    'bgMagentaBright',
    'bgCyanBright',
    'bgWhiteBright']
]
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type Color = keyof typeof Color
export type Decoration = keyof typeof Decoration
export type Background = keyof typeof Background

for( const id of chalkFns) {
    const fn = function(text: string) {
        return chalk[id](text)
    }
    RegisterLogFormater(fn, id)
}
RegisterLogFormater(function(text: string, r, g, b) {
    return chalk.rgb(r, g, b)(text)
}, 'rgb')
