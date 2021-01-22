import { WriteStream } from 'tty'

/* istanbul ignore next */
export function SpawnStreams() {
	return ['pipe', new WriteStream(1), 'pipe'] as [any, any, any]
}