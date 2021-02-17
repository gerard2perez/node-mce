import { readFileSync } from '../../mockable/fs'
import { mergeDeep } from '../../@utils/merge-deep'
import { callerPath } from '../../fs'
export interface ITSConfig { 
	compilerOptions: {
		baseUrl?: string,
		outDir?: string
		paths?: {
			[path: string]: string[]
		}
	}  
}
export function TSConfig(file: string) {
	let raw = readFileSync(callerPath(file), 'utf-8')
	raw = raw.replace(/(\/\*.*\*\/)/m, '')
	const tsConfig = JSON.parse(raw)
	let all = JSON.parse(JSON.stringify(tsConfig))
	if(tsConfig.extends) {
		const baseConfig = TSConfig(tsConfig.extends)
		all = mergeDeep({}, tsConfig, baseConfig)
	}
	return all as ITSConfig
}