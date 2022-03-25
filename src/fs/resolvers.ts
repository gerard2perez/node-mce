import { resolve } from 'path'
import { JoinPath } from './interface'

export let TEMPLATE = (folder: string) => {
	const res = cliPath('templates', folder)
	return res
}
export let PROJECT = (folder: string) => folder
export function pathResolver(_template: JoinPath, _target?: JoinPath) {
	TEMPLATE = _template
	//istanbul ignore else
	if(_target)PROJECT = _target
}

export function cliPath (...path: string[]) {
    return resolve(process.env.MCE_ROOT, ...path)
}
export function callerPath (...path: string[]) {
    return resolve(process.cwd(), ...path)
}