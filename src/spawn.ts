import { spawn } from 'cross-spawn-async';
import { SpawnOptions } from 'child_process';
function exec (cmd:string, options:string[], config:SpawnOptions) {
    return new Promise((resolve, reject)=>{
        spawn(cmd, options, config).on('error', reject).on('close', code => {
            (code === 0 ? resolve:reject)(code === 0);
        });
    });
    
}

export { exec as spawn };