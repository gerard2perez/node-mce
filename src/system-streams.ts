import { Writable, Readable } from "stream"
import { MainSpinner } from './spinner'
export const streams  = {
	output: process.stderr,
	input: process.stdin
}
export function SetStreams(output: Writable, input: Readable) {
	streams.output = output as any
	streams.input = input as any
	MainSpinner.stream = output
}
