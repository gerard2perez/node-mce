import { watch } from 'chokidar'
import { existsSync, unlinkSync } from '../../mockable/fs'
import { posix } from 'path'
import { logger, Mode } from './copy'
const {relative, join} = posix
function genId(baseDir: string, file: string) {
	return relative(baseDir, file.replace(/\\/, '/')).replace(/.ts|.js/, '')
}
// istanbul ignore next
function toLib(files: string[], outDir: string) {
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

	const trans = (file: string) => file.replace('lib', 'src').replace('.js', '.ts')
	watch(['./lib/**/*.js', '!**/node_modules/**/*'], {
		ignoreInitial: true, 
		awaitWriteFinish: {
			pollInterval: 300,
			stabilityThreshold: 100
		}
	})
		.on('change', file => logger(Mode.chn, trans(file)))
		.on('add', file => logger(Mode.add, trans(file)))
		.on('unlink', file => logger(Mode.rmv, trans(file)))

	watch(`${baseDir}/**/*.ts`)
		.on('unlink', function(file) {
			const transpiled = toLib([genId(baseDir, `./${file}`)], outDir)
			const source = toSrc(transpiled[0], outDir)
			for(const file of transpiled) {
				if(existsSync(file))unlinkSync(file)
			}
		})
}