import { dryRun } from './dry-run'
import { existsSync, lstatSync, readdirSync, unlinkSync } from '../mockable/fs'
import { RegisterDryRun } from './decorator'
import { join } from 'path'
import { print } from '../output'
function __unlink(dir: string, recursive = true) {
	dir = this.project(dir)
	if ( _unlink(dir, recursive) ) {
		print`{deleted|sy|blue} {${dir}|highlightBasename}`
	}
	
}
function _unlink(dir: string, /* istanbul ignore next */ recursive = true) {
	if(existsSync(dir)) {
		// istanbul ignore else
		if(lstatSync(dir).isDirectory())
		// istanbul ignore next
		for(const file of readdirSync(dir)) {
			const currentPath = join(dir, file)
			if(recursive && lstatSync(currentPath).isDirectory()) {
				return _unlink(currentPath)
			} else {
				dryRun(unlinkSync)(currentPath)
				return true
			}
		}
		dryRun(unlinkSync)(dir)
		return true
	}
	return false
}
export const unlink = RegisterDryRun(__unlink)