/* eslint-disable @typescript-eslint/ban-ts-comment */
jest.mock('../mockable/spawn-streams')
jest.mock('cross-spawn')
import './global-jest'
import { SpawnStreams } from '../mockable/spawn-streams'
import { STDOut } from './stdout'
import cspawn from 'cross-spawn'
export function mockSpawn(callback: string | ((stdout: STDOut, stderr: STDOut) => 0|1)) {
	SpawnStreams.mockReturnValueOnce(['pipe', new STDOut, new STDOut])
	cspawn.mockImplementationOnce((cmd, cmdOptions, options) => {
		const [_, stdout, stderr] = options.stdio as STDOut[]
		return {
			stderr: {
				on(event: string, cb: any){
					stderr.on(event, cb)
				}
			},
			stdout: {
				on(event: string, cb: any){
					stdout.on(event, cb)
				}
			},
			once(event: string, finalize: (code: number, signal: string) => void) {
				let exitCode = 0
				if(typeof callback === 'string') {
					stdout.emit('data', Buffer.from(exitCode.toString()))
				} else {
					exitCode = callback(stdout, stderr)
				}
				finalize(exitCode, 'SIG_TERM')
			}
		}
	})
}