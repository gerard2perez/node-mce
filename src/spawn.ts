/**
 * @module @bitsun/mce/utils
 */
import * as cspawn from 'cross-spawn';
import { SpawnOptions } from 'child_process';
import { spin } from './spinner';
/* istanbul ignore next */
export function spawn (cmd:string, options:any[], config:SpawnOptions, truefalse:boolean=true) {
    let buffer = '';
	let store = (chunck) => {buffer+=chunck.toString()};
    return new Promise((resolve, reject)=>{
		const child = cspawn(cmd, options, config);
        child.on('close', code => {
            if(truefalse) {
                resolve(code === 0);
            } else {
                if (code === 0) {
                    resolve(buffer);
                } else {
                    reject(`${cmd} ${options.join(' ')}\n` + buffer);
                }
            }
        });
        child.stdout.on('error', store);
        child.stderr.on('error', store);
		child.stdout.on('data', store);
        child.stderr.on('data', store);
    });
}
// istanbul ignore next
export function spinSpawn(message:string, cmd:string, options:any[], config:SpawnOptions={}) {
    return spin(message, async () =>{
        await spawn(cmd, options, config, false).catch(error=>error);
    });
}
export { cspawn as rawSpawn };