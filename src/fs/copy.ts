import { dryRun } from './dry-run'
import { copyFileSync } from '../mockable/fs'
import { RegisterDryRun } from './decorator'
import { fs_interface } from './interface'
import { ok } from '../console'
function _copy (this: fs_interface, source: string, target: string=source) {
	const _source = this.template(source)
	const _target = this.project(target)
	dryRun(copyFileSync)(_source, _target)
	ok`{${_target}|highlightBasename}`
}
export const copy = RegisterDryRun(_copy)