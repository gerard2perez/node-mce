import { dryRun } from  './dry-run'
import { existsSync, MakeDirectoryOptions, mkdirSync } from '../mockable/fs'
import { fs_interface } from './interface'
import { ok } from '../console'
import { RegisterDryRun } from './decorator'

function _mkdir(this: fs_interface, dir: string, options?: MakeDirectoryOptions) {
	dir = this.project(dir)
	// istanbul ignore else
	if(!existsSync(dir)) {
		dryRun(mkdirSync)(dir, options)
	}
	ok`{${dir}|highlightBasename}`
}
export const mkdir = RegisterDryRun(_mkdir)