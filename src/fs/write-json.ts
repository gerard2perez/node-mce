import { dryRun } from './dry-run'
import { writeFileSync } from '../mockable/fs'
import { fs_interface } from './interface'
import { ok } from '../output'
import { RegisterDryRun } from './decorator'

function _writeJSON(this: fs_interface, dir: string, content: unknown) {
	const target = this.project(dir)
	const stringified = JSON.stringify(content, null, 2)
	dryRun(writeFileSync)(target, stringified)
	ok`{${target}|highlightBasename}`
}
export const writeJSON = RegisterDryRun(_writeJSON)
