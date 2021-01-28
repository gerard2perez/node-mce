import { copyFileSync, existsSync, mkdirSync, unlinkSync } from '../../mockable/fs'
import { basename, dirname, normalize, posix, relative } from 'path'
import { log } from '../../console'
import { callerPath } from '../../fs'

export function copy(from: string, to: string) {
	const targetOath = dirname(to)
	// istanbul ignore else
	if(!existsSync(targetOath)) mkdirSync(targetOath, {recursive: true})
	copyFileSync(from, to)
	logger(Mode.cpy, to)
}
// istanbul ignore next
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
	log(0)`[{${new Date().toLocaleTimeString()}|grey}] [{${Mode[mode].toUpperCase()}|${mode}}] ${relativePath}/{${file}|${mode}}`
}