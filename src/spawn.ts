import { spawn } from 'cross-spawn-async';
import { SpawnOptions } from 'child_process';
import { spin } from './spinner';
import { error } from './console';
function exec (cmd:string, options:any[], config:SpawnOptions, truefalse:boolean=true) {
    let buffer = '';
    let store = (chunck) => {buffer+=chunck.toString()};
    return new Promise((resolve, reject)=>{
        const child = spawn(cmd, options, config);
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
async function spinSpawn(message:string, cmd:string, options:any[], config:SpawnOptions={}, truefalse:boolean=true) {
    await spin(message, async () =>{
        await exec(cmd, options, config, false).catch(error);
    });
    
}
export { exec as spawn, spinSpawn };