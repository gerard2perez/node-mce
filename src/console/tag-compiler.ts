/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: tag-compiler.ts
Created:  2022-03-17T05:42:51.036Z
Modified: 2022-03-17T05:43:10.155Z
*/

import { GetLogFormatter } from '../formatters'

export function tagcompiler(text: TemplateStringsArray, ...values: any[]) {
    let complete = text.reduce((message, part, index) => {
        return `${message}${part}${values[index]||''}`
    }, '')
    const exp = /\{([^}{]*)\}/gm
    let result: RegExpExecArray
    
	while(complete.includes('{'))
	// eslint-disable-next-line no-cond-assign
    while (result = exp.exec(complete)) {
        const [full, fnWithPipes] = result
        let [value, ...pipesWithArgs] = fnWithPipes.split('|')
        for(const pipeWithArgs of pipesWithArgs) {
            const [pipeName, ...args] = pipeWithArgs.trim().split(':')
			const pipe = GetLogFormatter(pipeName)
			// istanbul ignore else
            if(pipe) {
                value = pipe(value, ...args) /* istanbul ignore next */ || ''
            }
        }
        complete = complete.replace(full, value)
        exp.lastIndex = result.index + value.length
	}
    return complete
}