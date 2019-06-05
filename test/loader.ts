process.env.MCE_DEV = 'true';
import { resolve } from 'path';
import { MCE } from '../src';
let NODE_MCE = MCE('./test');
export function subcommand(command:string): Promise<{}>{
	return NODE_MCE.subcommand(command.split(' ')) as any;
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