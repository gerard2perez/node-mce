import { dryRun } from './dry-run'
import { readFileSync, writeFileSync } from '../mockable/fs'
import { fs_interface } from './interface'
import { ok } from '../console'
import { RegisterDryRun } from './decorator'
import { iter } from '../@utils/iter'
export function _render(this: fs_interface, source: string, data: unknown) {
	source = this.template(source)
	let info = readFileSync(source, 'utf-8')
    for(const [key, value] of iter(data)) {
        info = info.replace(new RegExp(`{{${key}}}`, 'gm'), value)
	}
    return info
} 

function _compile(this: fs_interface, source: string, data: {[p: string]: string}, target: string=source) {
	target = this.project(target)
	const compiled = render.bind(this)(source, data)
	dryRun(writeFileSync)(target, compiled)
	ok`{${target}|highlightBasename}`
}
export const compile = RegisterDryRun(_compile)
export const render = RegisterDryRun(_render)
