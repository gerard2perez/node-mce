/**
 * @module @gerard2p/mce
 */
export { TSConfig, ITSConfig } from './@utils/tsconfig'
export { PackageJSON, PackProperties } from './@utils/package-json'
export * from './output'
export * from './input'
export { information } from './program'
export { exec } from './spawn'
export { callerPath, cliPath } from './fs'
export * from './executer'
export * from './core'
export { dry, bool, collect, enumeration, floating, list, numeric, Parsed, range, verbose, text } from './legacy_core/options'
