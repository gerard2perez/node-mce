import { spawn } from 'cross-spawn-async';
import { SpawnOptions } from 'child_process';
function exec (cmd:string, options:string[], config:SpawnOptions, truefalse:boolean=true) {
    let buffer = '';
    let store = (chunck) => {buffer+=chunck.toString()};
    return new Promise((resolve, reject)=>{
        const child = spawn(cmd, options, config);
        child.on('close', code => {
            if(truefalse) {
                resolve(code === 0);
            } else {
                if (code === 0) {
                    resolve(true);
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

export { exec as spawn };