/* eslint-disable @typescript-eslint/no-empty-function */
import { SpawnOptions } from 'child_process'
import cspawn from 'cross-spawn'
import { WriteStream } from 'tty'
import { dryRun } from './fs/dry-run'
import { SpawnStreams } from './mockable/spawn-streams'
import { wait } from './spinner'
export { cspawn as rawSpawn }
export function exec(cmd: string, cmdOptions: string[], /* istanbul ignore next */ options: SpawnOptions = {}) {
	return new LiveStream(cmd, cmdOptions, options)
}

export type StreamEvent = (chunk: Buffer) => void
export class LiveStream {
	private stdout: WriteStream = null
	private stderr: WriteStream = null
	#onData: StreamEvent = _ => {}
	#onError: StreamEvent
	#arguments: [string, string[], SpawnOptions]
	output: Buffer = Buffer.allocUnsafe(0)
	constructor(cmd: string, cmdOptions: string[], /* istanbul ignore next */ options: SpawnOptions = {}) {
		options.env = options.env || process.env
		options.env.FORCE_COLOR = options.env.FORCE_COLOR || 'true'
		this.#arguments = [cmd, cmdOptions, {...{ stdio: SpawnStreams()}, ...options}]
		const streams = (this.#arguments[2].stdio as any[]).map(stream => stream==='pipe'?undefined:stream)
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
	dryRun(result: string, ms_wait = 0) {
		return dryRun(
			() => this as LiveStream,
			() => {
				return {
					run() {
						return wait(ms_wait).then(() => Promise.resolve(Buffer.from(result)))
					}
				} as unknown as LiveStream
			}
		)()
	}
	/**
	 * Executes the program and captures the output using TTY if stdio is not set.
	 * 
	 * If you want to capture stderr you must call .error function first.
	 */
	async run(): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const child = cspawn(...this.#arguments)
			// istanbul ignore next
			const stdout = child.stdout || this.stdout
			// istanbul ignore next
			const stderr = child.stderr || this.stderr
			if(this.#onError) stdout.on('error', this.catchAndRelease.bind(this, this.#onError))
			if(this.#onError) stderr.on('error', this.catchAndRelease.bind(this, this.#onError))
			stdout.on('data', this.catchAndRelease.bind(this, this.#onData))
			stderr.on('data', this.catchAndRelease.bind(this, this.#onData))
			child.once('close', (code, _signal) => {
				if(code === 0) {
					resolve(this.output)
				} else {
					reject(this.output.toString())
				}
			})
		})
	}
}
