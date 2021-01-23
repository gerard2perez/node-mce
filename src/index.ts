/**
 * @module @gerard2p/mce
 */
import { MCEProgram } from './mce-cli'

export { PackageJSON, PackProperties } from './@utils/package-json'
export * from './console'
export { bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from './core/options'
export { information } from './program'
export { exec } from './spawn'
export { updateTextSpin as SetSpinnerText } from './spinner/console'
export { callerPath, cliPath } from './tree-maker/fs'
export function MCE (localdir?: string) {
	return new MCEProgram(localdir)
}
