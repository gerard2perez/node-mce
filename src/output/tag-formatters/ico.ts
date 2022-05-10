/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: ico.ts
Created:  2022-03-17T05:35:48.335Z
Modified: 2022-03-26T04:17:02.306Z
*/

import { LogSymbols } from '../spinner/symbols'
import { RegisterLogFormatter } from './register-log-formatter'



RegisterLogFormatter(function(symbol: string) {
    return LogSymbols[symbol]
}, 'sy')
RegisterLogFormatter(function(symbol: string) {
    return LogSymbols[symbol]
}, 'ico')