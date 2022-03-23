/**
 * @module @gerard2p/mce
 */
export { TSConfig, ITSConfig } from './@utils/tsconfig'
export { PackageJSON, PackProperties } from './@utils/package-json'
export * from './console'
export * from './spinner/control'
export * from './spinner'
export * from './formatters'
export { information } from './program'
export { exec } from './spawn'
export { SetSpinnerText } from './spinner/console'
export { callerPath, cliPath } from './fs'
export * from './director'
export * from './core'
export { dry, bool, collect, enumeration, floating, list, numeric, Parsed, range, verbose, text } from './legacy_core/options'
