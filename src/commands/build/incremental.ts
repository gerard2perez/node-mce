import { watch } from 'chokidar'
import { existsSync, readFileSync, unlinkSync } from '../../mockable/fs'
import { sync } from 'glob'
import { posix } from 'path'
import { logger, unlink, Mode } from './copy'
const {relative, join, normalize} = posix
interface fileInfo {
	version: string
	signature: string
	affectsGlobalScope: boolean
}
interface fileInfos {
	[file: string]: fileInfo
}
const fileVersions = new Map<string, string>()
const sourcesTo = new Map<string, string>()
// istanbul ignore next
function createInitialCache() {
	const {program: {fileInfos}} = JSON.parse(readFileSync('./incremental.tsbuildinfo', 'utf-8')) as { program: { fileInfos: fileInfos}}
	const preCompiled = Object.keys(fileInfos).filter(f => !f.includes('node_modules'))
	for(const file of preCompiled) {
		const newVersion = fileInfos[file] && fileInfos[file].version
		fileVersions.set(file, newVersion)
	}
	console.log('\n[READY]\n')
}
function genId(baseDir: string, file: string) {
	return relative(baseDir, file.replace(/\\/, '/')).replace(/.ts|.js/, '')
}
// istanbul ignore next
function detectChanges(outDir: string, baseDir: string) {
	sourcesTo.clear()
	const {program: {fileInfos}} = JSON.parse(readFileSync('./incremental.tsbuildinfo', 'utf-8')) as { program: { fileInfos: fileInfos}}
	const preCompiled = Object.keys(fileInfos).filter(f => !f.includes('node_modules'))
	const compiled = preCompiled.map(o => {
		const transformed = genId(baseDir, o)
		sourcesTo.set(transformed, o)
		sourcesTo.set(o, transformed)
		return transformed
	})
	const transpiledFiles = sync(`${outDir}/**/*.js`, 
								{ ignore: ['**/@gerard2p/**/*', `${outDir}/node_modules/**/*`, 
								`${outDir}/templates/**/*`], dot: true}
							)
							.map((o: string) => genId(outDir, o))
    const fileToRemove = toLib(xor(transpiledFiles, compiled), outDir)
    for(const file of fileToRemove) {
        if(existsSync(file)) {
			const sourceFile = toSrc(file, outDir)
			if( fileVersions.has(sourceFile) ) {
				console.log('rmoves0', sourceFile)
				fileVersions.delete(sourceFile)
				unlink(file)
			}
			
		}
	}
	for(const file of preCompiled) {
		const oldVersion = fileVersions.get(file)
		const newVersion = fileInfos[file] && fileInfos[file].version
		if(newVersion!==oldVersion) {
			if(!oldVersion) {
				logger(Mode.add, file)
			} else if(!newVersion) {
				console.log('file deleted0', file)
			} else {
				logger(Mode.chn, file)
			}
			fileVersions.set(file, newVersion)
		}
	}
}
// istanbul ignore next
function xor(arr1, arr2) {
	const arr3 = [...arr2, ...arr1].filter((v, i, a) => i===a.indexOf(v))
	const result = []
	for(const entry of arr3) {
		if(!arr2.includes(entry) || !arr1.includes(entry)) {
			result.push(entry)
		}
	}
	return result
}
// istanbul ignore next
function toLib(files: string[], outDir: string) {
	// console.log(files, outDir)
	// eslint-disable-next-line prefer-spread
	const all = [].concat.apply([], 
		files.map(file => join(outDir, file))
			.map(file => [
				`${file}.d.ts`,
				`${file}.js.map`,
				`${file}.js`
			])
		)
	return all as string[]
}
function toSrc(file: string, outDir: string) {
	return './' + join('./src', relative(outDir, file).replace(/.js|.d.ts|.map/, '.ts'))
}
export function WatchIncremental(outDir: string, baseDir = './src') {
	watch('./incremental.tsbuildinfo', {
		ignored: 'node_modules',
		awaitWriteFinish: {
			pollInterval: 300,
			stabilityThreshold: 100
		}
	})
		.on('change', detectChanges.bind(undefined, outDir, baseDir))
		.on('add', createInitialCache)
	watch(`${baseDir}/**/*.ts`)
		.on('unlink', function(file) {
			const transpiled = toLib([genId(baseDir, `./${file}`)], outDir)
			const source = toSrc(transpiled[0], outDir)
			for(const file of transpiled) {
				if(existsSync(file))unlinkSync(file)
			}
			fileVersions.delete(source)
			logger(Mode.rmv, source)
		})
}