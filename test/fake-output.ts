import { Stream } from 'stream';
import { WriteStream, appendFileSync, unlinkSync, writeFileSync } from 'fs';
import { LogSymbols } from '../src/spinner/symbols';
export class FakeStream extends Stream.Writable {
	content:string = '';
	isFake = true;
	isTTY:boolean = true;
	clearLine(){
		let line = this.content.split('\n');
		line[line.length -1] = '';
		this.content = line.join('\n');
		return this.persist();
	}
	cursorTo(){
		// this.lines.pop();
		// return this.persist();
	}
	clear() {
		this.content = "";
		this.persist();
	}
	constructor(public path:string) {
		super({	
		});
		try{unlinkSync(path);}catch(ex){}
	}
	write(chunck:any, cb:any) {
		let text:string = chunck.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
		this.content += text;
		return this.persist();
	}
	persist(){
		writeFileSync(this.path, this.content);
		return true;
	}
}