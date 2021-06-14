/* eslint-disable no-control-regex */
import { Stream } from 'stream'
export class STDOut extends Stream.Writable {
	content = ''
	isFake = true
	isTTY = false
	clearLine(){
		const line = this.content.split('\n')
		line[line.length -1] = ''
		this.content = line.join('\n')
	}
	cursorTo(){
		// this.lines.pop();
		// return this.persist();
	}
	clear() {
		this.content = ''
		// this.persist();
	}
	write(chunck: any) {
		console.log('STDout0')
		console.log('STDout1', chunck)
		const text: string = chunck.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')

		console.log('STDout2', text)


		this.content += text
		return true
	}
	read() {
		const {content } = this
		this.content = ''
		return content
	}
}