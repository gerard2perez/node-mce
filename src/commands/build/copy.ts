import { copyFileSync, existsSync, mkdirSync, unlinkSync } from '../../mockable/fs'
import { basename, dirname, normalize, posix, relative } from 'path'
import { print } from '../../console'
import { callerPath } from '../../fs'

export function copy(from: string, to: string) {
	const targetOath = dirname(to)
	// istanbul ignore else
	if(!existsSync(targetOath)) mkdirSync(targetOath, {recursive: true})
	copyFileSync(from, to)
	logger(Mode.cpy, to)
}
// istanbul ignore next
export function unlink(to: string) {
	if(existsSync(to)) unlinkSync(to)
	logger(Mode.rmv, to)
}
export enum Mode {
	add = <any>'yellow',
	cpy = <any>'green',
	rmv = <any>'red',
	chn = <any>'blue'
}
export function logger(mode: Mode, path: string) {
	const relativeFile = relative(callerPath(), path)
	const file = basename(normalize(relativeFile))
	const relativePath = dirname(relativeFile).replace(/\\/gm, posix.sep)
	print`[{${new Date().toLocaleTimeString()}|grey}] [{${Mode[mode].toUpperCase()}|${mode}}] ${relativePath}/{${file}|${mode}}`
}