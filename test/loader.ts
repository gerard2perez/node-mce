process.env.MCE_DEV = 'true';
import { MCE } from '../src';
let NODE_MCE = MCE('./test');
export function subcommand(command:string): Promise<{}>{
	return NODE_MCE.subcommand(command.split(' ')) as any;
}
export function command(command:string): Promise<{}> {
	return NODE_MCE.command(command.split(' ')) as any;
}
export function loader(path:string){
	NODE_MCE = MCE(path);
}
export function toggleHelp() {
	NODE_MCE.help = !NODE_MCE.help;
}