import { Writable, Readable } from "stream";
export let main_output = process.stderr;
export let main_input = process.stdin;
export function setMainOutput(stream:Writable) {
	main_output = stream as any;
}
export function setMainInput(stream:Readable) {
	main_input = stream as any;
}