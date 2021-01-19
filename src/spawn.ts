import cspawn from 'cross-spawn';
import { SpawnOptions } from 'child_process';
import { spin } from './spinner';
import { WriteStream } from 'tty'
import { SpawnStreams } from './mockable/spawn-streams';
/**
 * 
 * @deprecated use exec instead
 */
/* istanbul ignore next */
export function spawn (cmd:string, options:any[], config:SpawnOptions, truefalse:boolean=true) {
    let buffer = '';
	let store = (chunck) => {buffer+=chunck.toString()};
	/* istanbul ignore next */
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
/**
 * 
 * @deprecated use spin and exec instead
 */
// istanbul ignore next
export function spinSpawn(message:string, cmd:string, options:any[], config:SpawnOptions={}) {
    return spin(message, async () =>{
		return (await spawn(cmd, options, config, true)) ? `s) ${cmd} ${options.join(' ')}`:`e) ${cmd} ${options.join(' ')}`;
    });
}
export { cspawn as rawSpawn };
export function exec(cmd: string, cmdOptions: string[], /* istanbul ignore next */ options: SpawnOptions = {}) {
	return new LiveStream(cmd, cmdOptions, options)
}

export type StreamEvent = (chunk: Buffer) => void
export class LiveStream {
	private stdout: WriteStream = null
	private stderr: WriteStream = null
	#onData: StreamEvent = _ =>{}
	#onError: StreamEvent
	#arguments: [string, string[], SpawnOptions]
	output: Buffer = Buffer.allocUnsafe(0)
	constructor(cmd: string, cmdOptions: string[], /* istanbul ignore next */ options: SpawnOptions = {}) {
		this.#arguments = [cmd, cmdOptions, {...{stdio: SpawnStreams()}, ...options}]
		const streams = this.#arguments[2].stdio as any[]
		this.stdout = streams[1]
		this.stderr = streams[2]
	}
	catchAndRelease(fn: StreamEvent, chunk: Buffer) {
		this.output = Buffer.concat([this.output, chunk])
		fn(chunk)
	}
	data(onData: StreamEvent) {
		this.#onData = onData
		return this
	}
	error(/* istanbul ignore next */ onError: StreamEvent = _ => {}) {
		this.#onError = onError
		return this
	}
	/**
	 * Executes the program and captures the output using TTY if stdio is not set.
	 * 
	 * If you want to capture stderr you must call .error function first.
	 */
	async run(): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const child = cspawn(...this.#arguments)
			if(this.#onError) this.stdout.on('error', this.catchAndRelease.bind(this, this.#onError))
			if(this.#onError) this.stderr.on('error', this.catchAndRelease.bind(this, this.#onError))
			this.stdout.on('data', this.catchAndRelease.bind(this, this.#onData))
			this.stderr.on('data', this.catchAndRelease.bind(this, this.#onData))
			child.once('close', (code, signal)=>{
				if(code === 0) {
					resolve(this.output)
				} else {
					reject(this.output)
				}
			})
		})
	}
}
