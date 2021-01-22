import chokidar from 'chokidar'
import { existsSync, readFileSync } from 'fs'
import { sync } from 'glob'
import { posix } from 'path'
import { unlink } from './copy'
const {relative, join} = posix
function removeUnwanted(path, stats) {
    const {program: {fileInfos}} = JSON.parse(readFileSync('./incremental.tsbuildinfo', 'utf-8'))
    const compiled = Object.keys(fileInfos).filter(f => !f.includes('node_modules')).map(o => relative('./src', o).replace('.ts', ''))
    const sources = sync('lib/**/*.js', { ignore: ['**/@gerard2p/**/*', 'lib/node_modules/**/*', 'lib/templates/**/*'], dot: true}).map(o => relative('./lib', o.replace('.js', '')))
    const fileToRemove = toLib(xor(sources, compiled))
    for(const file of fileToRemove) {
        if(existsSync(file)){
			unlink(file, file)
		}
    }
  }
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
function toLib(files) {
	// eslint-disable-next-line prefer-spread
	const all = [].concat.apply([], files.map(f => join('lib', f)).map(f => [`${f}.d.ts`, `${f}.js.map`, `${f}.js`]))
	return all
}

export function WatchIncremental() {
	chokidar.watch('./incremental.tsbuildinfo')
		.on('change', removeUnwanted)
		.on('add', removeUnwanted)
}