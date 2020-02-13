import { MainSpinner } from "./spinner";
import { LogSymbols } from "./spinner/symbols";
function verbose(lvl:number, fn:string, text:string) {
    if( parseInt(process.env.MCE_VERBOSE) >= lvl)
        MainSpinner[fn](text)
}
/**
 * Level 2 verbosity function
 */
export function info(text:string){ verbose(2,'info', text); }
/**
 * Level 1 verbosity function
 */
export function warn(text:string){ verbose(1,'warn', text); }
export function error (text:string) { MainSpinner.error(text); }
export function ok (text:string) { MainSpinner.ok(text); }
export function updated (text:string) { MainSpinner.persist({text, symbol:LogSymbols.updated}); }
export function created (text:string) { MainSpinner.persist({text, symbol:LogSymbols.success}); }