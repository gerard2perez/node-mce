import { dryRun } from './dry-run'
import { writeFileSync } from '../mockable/fs'
import { fs_interface } from './interface'
import { ok } from '../console'
import { RegisterDryRun } from './decorator'

function _write(this: fs_interface, target: string, content: string) {
	target = this.project(target)
	dryRun(writeFileSync)(target, content)
	ok`{${target}|highlightBasename:green}`
}
export const write = RegisterDryRun(_write)