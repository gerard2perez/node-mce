import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { SourceMapConsumer } from 'source-map'
import { cliPath } from '../fs'
export async function UseSourceMaps(error: Error) {
	const root = cliPath()
	try{
	const showInternal = process.env.MCE_TRACE_SHOWINTERNAL === 'true'
	const showMCE = process.env.MCE_TRACE_SHOWMCE === 'true'
	const stack = error.stack.split('\n')
	const parsed = stack.filter(line => {
		if(!showMCE && line.search(/@gerard2p.mce/)>-1) {
			error.stack = error.stack.replace(`${line}\n`, '')
		}
		// istanbul ignore if
		if(!showInternal && line.includes('internal/')) {
			error.stack = error.stack.replace(`${line}\n`, '').replace(line, '')
		}
		return !line.includes('internal/')
	})
	.map(lineText => {
		const expresion = new RegExp(`${root.replace(/\\/gmi, '\\\\')}(.*).js`, 'g')
		const matches = lineText.match(/.* \(?(.*):([0-9]*):([0-9]*)/) || []
		const simple = lineText.match(expresion)
		let [_, file, line, column] = matches
		let replacement = lineText.replace(`${file}:${line}:${column}`, '$1')
		if(lineText === replacement && simple) {
			file = simple[0]
			replacement = lineText.replace(simple[0], '$1')
		}
		return {
			lineText,
			replacement,
			file, 
			line,
			column
		}
	})
	for(const {replacement, lineText, file, line, column} of parsed) {
		const mapFile = `${file}.map`
		if(!existsSync(mapFile)) continue
		const sourceMap = readFileSync(`${file}.map`, 'utf-8')
		const consumer = await new SourceMapConsumer(sourceMap)
		const res = consumer.originalPositionFor({
			line: parseInt(line),
			column: parseInt(column)
		})
		const newLine = res.source ? 
			replacement.replace('$1', `${join(dirname(file), res.source)}:${res.line}:${res.column}`) : 
			replacement.replace('$1', file.replace('.js', '.ts').replace('lib', 'src'))
		error.stack = error.stack.replace(lineText, newLine)
	}
}catch(internal_error: unknown) {
	console.error(internal_error)
}
}