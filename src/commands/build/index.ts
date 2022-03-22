import { bool, Parsed, text } from '../../legacy_core/options'
import { exec } from '../../spawn'
import { SyncFiles } from './sync'
import { TSConfig } from '../../@utils/tsconfig'
import { print } from '../../console'
import { existsSync, unlinkSync } from '../../mockable/fs'
let firstReport = false
export const options = {
	watch: bool('-w', 'watches for changes'),
	tsc: text('-c', 'path to tsc', './node_modules/.bin/ttsc'),
	tsconfig: text('-t', 'selects the tsconfig file', 'tsconfig.json')
}
export const args = '...[patterns]'
export async function action(patterns: string[], opt: Parsed<typeof options>) {
	const incrementalFile = './incremental.tsbuildinfo'
	const TSCONFIG = TSConfig(opt.tsconfig, true)
	const builOptions = ['--incremental', '--tsBuildInfoFile', incrementalFile, '-p', opt.tsconfig]
	if(existsSync(incrementalFile)) unlinkSync(incrementalFile)
	const { WatchIncremental } = await import('./incremental')
	const keepWatching = SyncFiles(patterns, TSCONFIG.compilerOptions.outDir)
	if(opt.watch) {
		WatchIncremental(TSCONFIG.compilerOptions.outDir)
		builOptions.push('-w')
		keepWatching()
	}
	await exec(opt.tsc, builOptions)
	.dryRun('').data(ev => {
		const lines = ev.toString().split(/[\r\n]/gm)
		lines.filter(f => f).forEach(line => reportLine(line))
	}).run()
	
}
function reportLine(line: string) {
	const [file, error=''] = line.split(' error ')
	const date = new Date().toLocaleTimeString()
	if(line.includes(' error ')) {
		const [_, TS, desc] = /.*(TS.*:) (.*)/gm.exec(error) || []
		const [__, source, row, column] =  /(.*)\(([0-9]*),([0-9]*).*/gm.exec(file) || []
		print`{|padl:10} {${source}|cyan}:{${row}|yellow}:{${column}|yellow} - {error|red} {${TS}|grey} ${desc}`
	} else if(line.startsWith('[MCE]') ) {
		let message = line
		const [_, KIND, MESSAGE] = /\[MCE]\[(.*)](.*)/g.exec(line)
		switch(KIND) {
			case 'WRN':
				message = `[{MCE|yellow}] {warning|sy|yellow} {${MESSAGE}|yellow|bold}`
				break
		}
		print`[{${date}|grey}] ${message}`
	} else if (line.includes('Watching for file changes') && !firstReport) {
		firstReport = true
		print`[{${date}|grey}] [READY]`
	}
}
