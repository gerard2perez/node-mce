import { existsSync, unlinkSync } from '../../mockable/fs'
import { bool, Parsed, text } from '../../core/options'
import { exec } from '../../spawn'
import { SyncFiles } from './sync'
import { TSConfig } from './tsconfig'
import { log } from '@gerard2p/mce/console'
export const options = {
	watch: bool('-w', 'watches for changes'),
	tsc: text('-c', 'path to tsc', 'tsc'),
	tsconfig: text('-t', 'selects the tsconfig file', 'tsconfig.json')
}
export const args = '...[patterns]'
export async function action(patterns: string[], opt: Parsed<typeof options>) {
	const incrementalFile = './incremental.tsbuildinfo'
	const TSCONFIG = TSConfig(opt.tsconfig)
	const builOptions = [opt.tsc, '--incremental', '--tsBuildInfoFile', incrementalFile, '-p', opt.tsconfig]
	if(existsSync(incrementalFile)) unlinkSync(incrementalFile)
	const { WatchIncremental } = await import('./incremental')
	const keepWatching = SyncFiles(patterns, TSCONFIG.compilerOptions.outDir)
	if(opt.watch) {
		WatchIncremental(TSCONFIG.compilerOptions.outDir)
		builOptions.push('-w')
		keepWatching()
	}
	await exec('npx', builOptions)
	// .data(d => log(0)`${d}`)
	.dryRun('').run()
	// .then().catch(err => console.log(err.toString()))
}
