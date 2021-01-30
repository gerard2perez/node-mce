/**
 * @module @gerard2p/mce
 */
import { MCEProgram } from './mce-cli'

export { PackageJSON, PackProperties } from './@utils/package-json'
export * from './console'
export * from './spinner/control'
export * from './spinner'
export { dry, bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from './core/options'
export { information } from './program'
export { exec } from './spawn'
export {  SetSpinnerText } from './spinner/console'
export { callerPath, cliPath } from './fs'
export function MCE (localdir?: string) {
	return new MCEProgram(localdir)
}
