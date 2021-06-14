import { Readable } from 'stream'

export class STDIn extends Readable {
	isTTY = true
	constructor() {
		super()
	}
	write(message: string) {
		console.log('STDin', message)
		this.push(message+'\n')
	}
	_read() {
		return null
	}
}