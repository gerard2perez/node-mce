import { Stream } from 'stream';
export class FakeStream extends Stream.Writable {
	content:string = '';
	isFake = true;
	isTTY:boolean = true;
	clearLine(){
		let line = this.content.split('\n');
		line[line.length -1] = '';
		this.content = line.join('\n');
	}
	cursorTo(){
		// this.lines.pop();
		// return this.persist();
	}
	clear() {
		this.content = "";
		// this.persist();
	}
	write(chunck:any) {
		let text:string = chunck.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
		this.content += text;
		return true;
	}
}