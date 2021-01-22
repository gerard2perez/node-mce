import { readFileSync } from 'fs'
import { mergeDeep } from '../../@utils/merge-deep'
import { callerPath } from '../../tree-maker/fs'

export function TSConfig(file: string) {
	const tsConfig = JSON.parse(readFileSync(callerPath(file), 'utf-8'))
	let all = JSON.parse(JSON.stringify(tsConfig))
	if(tsConfig.extends) {
		const baseConfig = TSConfig(tsConfig.extends)
		all = mergeDeep({}, tsConfig, baseConfig)
	}
	return all as { outDir: string }
}