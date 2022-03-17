/**
 * @module @gerard2p/mce
 */
import { MCEProgram } from './mce-cli'
export { TSConfig, ITSConfig } from './@utils/tsconfig'
export { PackageJSON, PackProperties } from './@utils/package-json'
export * from './console'
export * from './spinner/control'
export * from './spinner'
export * from './formatters'
export { dry, bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from './legacy_core/options'
export { information } from './program'
export { exec } from './spawn'
export { SetSpinnerText } from './spinner/console'
export { callerPath, cliPath } from './fs'
export * from './director'
export * from './core'
/**
 * @deprecated
 * @param localdir 
 * @returns 
 */
export function MCE (localdir?: string) {
	return new MCEProgram(localdir)
}
