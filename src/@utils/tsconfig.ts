import { readFileSync } from '../mockable/fs'
import { mergeDeep } from '../@utils/merge-deep'
import { callerPath } from '../fs'
export interface ITSConfig {
	'ts-node-dev'?: {
		require: string[]
	}
	'ts-node'?: {
		require: string[]
	}
	compilerOptions: {
		baseUrl?: string,
		outDir?: string
		paths?: {
			[path: string]: string[]
		}
	}
	include: string[]
	exclude: string[]
}
export function TSConfig(file: string, extend = false) {
	let raw = readFileSync(callerPath(file), 'utf-8')
	raw = raw.replace(/(\/\*.{1,}\*\/)/m, '')
	const tsConfig = JSON.parse(raw)
	let all = JSON.parse(JSON.stringify(tsConfig))
	if(extend && tsConfig.extends) {
		const baseConfig = TSConfig(tsConfig.extends)
		all = mergeDeep({}, tsConfig, baseConfig)
	}
	return all as ITSConfig
}