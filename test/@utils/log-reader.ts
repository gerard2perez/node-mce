import { readFileSync as readFile } from 'fs'
import { posix } from 'path'
export function readLog(path: string) {
	return readFile(posix.join(__dirname.replace('@utils', ''), 'logs', path), 'utf-8').replace(/\r/g, '')
}