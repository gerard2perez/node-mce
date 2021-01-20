/**
 * @module @gerard2p/mce
 */
import { MCEProgram } from "./mce-cli";

export { bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from './core/options';
export { information } from './program';
export { callerPath, cliPath } from './tree-maker/fs';
export function MCE (localdir?:string) {
	return new MCEProgram(localdir);
}
