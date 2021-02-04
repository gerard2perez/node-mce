import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { SourceMapConsumer } from 'source-map'
export async function UseSourceMaps(error: Error) {
	const showInternal = process.env.MCE_TRACE_SHOWINTERNAL === 'true'
	const showMCE = process.env.MCE_TRACE_SHOWMCE === 'true'
	const stack = error.stack.split('\n')
	const parsed = stack.filter(line => {
		if(!showMCE && line.search(/@gerard2p.mce/)>-1) {
			error.stack = error.stack.replace(`${line}\n`, '')
		}
		// istanbul ignore if
		if(!showInternal && line.includes('internal/')) {
			error.stack = error.stack.replace(`${line}\n`, '')
		}
		return !line.includes('internal/') && line.includes('at ')
	})
	.map(lineText => {
		const matches = lineText.match(/.* \(?(.*):([0-9]*):([0-9]*)/)
		const [_, file, line, column] = matches
		return {
			lineText,
			replacement: lineText.replace(`${file}:${line}:${column}`, '$1'),
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
		const targetFile = join(dirname(file), res.source)
		const newLine = replacement.replace('$1', `${targetFile}:${res.line}:${res.column}`)
		error.stack = error.stack.replace(lineText, newLine)
		return error
	}
}