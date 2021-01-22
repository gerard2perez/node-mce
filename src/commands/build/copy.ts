import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { basename, dirname, normalize, posix, relative } from 'path'
import { callerPath } from '../../tree-maker/fs'
import { log } from '../../verbose'

export function copy(from: string, to: string) {
	const targetOath = dirname(to)
	if(!existsSync(targetOath)) mkdirSync(targetOath, {recursive: true})
	copyFileSync(from, to)
	logger(Mode.cpy, to)
}
export function unlink(from: string, to: string) {
	if(existsSync(to)) unlinkSync(to)
	logger(Mode.rmv, to)
}
enum Mode {
	cpy = <any>'green',
	rmv = <any>'red'
}
export function logger(mode: Mode, path: string) {
	const relativeFile = relative(callerPath(), path)
	const file = basename(normalize(relativeFile))
	const relativePath = dirname(relativeFile).replace(/\\/gm, posix.sep)
	log(0)`[{grey ${new Date().toLocaleTimeString()}}] [{${mode} ${Mode[mode].toUpperCase()}}] ${relativePath}/{${mode} ${file}}`
}