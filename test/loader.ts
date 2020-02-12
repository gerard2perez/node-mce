process.env.MCE_DEV = 'true';
import { resolve } from 'path';
import { MCE } from '../src';
import { FakeStream } from './fake-output';
import { cliSpinner } from '../src/spinner';
let NODE_MCE = MCE('./test');
const stream = new FakeStream;
cliSpinner({text: '',stream, enabled:true});
export function subcommand(command:string): Promise<{}>{
	stream.clear();
	return NODE_MCE.subcommand(command.split(' ')).then(res=>{
		return stream.content || res;
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