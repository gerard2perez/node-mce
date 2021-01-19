import { WriteStream } from "tty";

/* istanbul ignore next */
export function SpawnStreams() {
	return ['pipe', new WriteStream(1), new WriteStream(2)] as [any, any, any]
}