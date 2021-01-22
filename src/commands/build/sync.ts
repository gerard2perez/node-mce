import { watch } from 'chokidar'
import { sync } from 'glob'
import { relative } from 'path'
import { PackageJSON } from '../../@utils/package-json'
import { callerPath } from '../../tree-maker/fs'
import { copy, unlink } from './copy'
export function SyncFiles(patterns: string[], outDir = './lib') {
	const localPackage = new PackageJSON(callerPath('package.json'))
	const bins = Object.keys(localPackage.bin).map(bin => localPackage.bin[bin]).map(bin => `${sync(bin)}:.`)
	patterns = [
		'templates/**/*:.',
		'?(package.json|README.md|LICENSE):.',
		...bins,
		...patterns
	]
	const AllPatterns = []
	const copyTO = patterns.map(pattern => pattern.split(':')).reduce((mapping, curr) => {
		const [pattern, target = '.'] = curr
		AllPatterns.push(pattern)
		const targetDir = relative(callerPath(), callerPath(outDir, target))
		const allMatches = mapping.get(targetDir) || []
		const matches = sync(pattern, {nodir: true, dot: true, ignore: ['node_modules']}) || []
		allMatches.push(...matches)
		mapping.set(targetDir, allMatches)
		return mapping
	}, new Map<string, string[]>())
	const AllFiles = []
	for(const [_target, patterns] of copyTO.entries()) {
		for(const file of patterns) {
			AllFiles.push(file)
			copy(file, callerPath(outDir, file))
		}
	}
	function targetPath(fn: any) {
		return function (file: string) {
			fn(file, callerPath(outDir, file))
		}
	}
	return function KeepInSync() {
		watch(AllPatterns, {ignoreInitial: true, awaitWriteFinish: {
			pollInterval: 300,
			stabilityThreshold: 100
		}})
		.on('unlink', targetPath(unlink))
		.on('change', targetPath(copy))
		.on('add', targetPath(copy))
		.on('addDir', (evet) => {
			console.log('addDir', evet)
			targetPath(evet)
		})
		.on('unlinkDir', (evet) => {
			console.log('unlinkDir', evet)
			targetPath(evet)
		})
		.on('error', e => console.log('[ERROR]', e))
	}
	console.log(AllPatterns)
}