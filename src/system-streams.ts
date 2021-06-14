import { Readable, Writable } from 'stream'
export const streams  = {	
	output: process.env.MCE_TEST === 'test' ? undefined :  process.stdout,
	input: process.env.MCE_TEST === 'test' ? undefined :  process.stdin,
}
export function SetStreams(output: Writable, input: Readable) {
	streams.output = output as any
	streams.input = input as any
}
