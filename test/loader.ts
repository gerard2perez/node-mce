process.env.MCE_DEV = 'true';
import { setMainOutput, setMainInput } from '../src/system-streams';
import { FakeStream } from './fake-output';
import { Readable } from 'stream';
export const output = new FakeStream;
class FakeInput extends Readable {
	isTTY:boolean = true;
	constructor() {
		super();
	}
	write(message:string) {
		this.push(message+'\n');
	}
	_read() {
		return null;
	}
}
export const input = new FakeInput;
setMainOutput(output);
setMainInput(input);


import { resolve } from 'path';
import { MCE } from '../src';
let NODE_MCE = MCE('./test');
export function subcommand(command:string): Promise<{}>{
	output.clear();
	return NODE_MCE.subcommand(command.split(' ')).then(res=>{
		return output.content || res;
	}) as any;
}
export function subCommandWithModule(config:string, command:string): Promise<{}>{
	return NODE_MCE.submodules(config).subcommand(command.split(' ')) as any;
}
export function command(command:string): Promise<{}> {
	return NODE_MCE.command(command.split(' ')) as any;
}
export function loader(path:string){
	NODE_MCE = MCE(resolve(path));
}