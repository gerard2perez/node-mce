process.env.MCE_DEV = 'true';
import { join, resolve } from 'path';
import { Readable } from 'stream';
import { existsSync, readdirSync } from '../src/fs';
// import { MCE } from '../src';
import { setMainInput, setMainOutput } from '../src/system-streams';
import { FakeStream } from './fake-output';
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
const origin = join(__dirname, '../');
const {MCE} = require('../src');
let NODE_MCE = MCE('./test');
export function subcommand(command:string): Promise<{}>{
	output.clear();
	return NODE_MCE.subcommand(command.split(' ')).then(res=>{
		return output.content || res;
	}) as any;
}
export function subCommandWithModule(config:string, command:string): Promise<{}>{
	return NODE_MCE.withPlugins(config, command.split(' '))as any;
}
export function command(command:string): Promise<{}> {
	return NODE_MCE.command(command.split(' ')) as any;
}
export function loader(path:string){
	process.chdir(join(origin, path));
	process.argv.push('', resolve());
	NODE_MCE = MCE(join(origin, path));
}
export function reset() {
	NODE_MCE.commandMapping = new Map();
	NODE_MCE.commands_map = {
		_owned: [],
		_local: [],
		plugins: []
	};
	// process.chdir(origin);
}
export function restore() {
	process.chdir(origin);
}
export function findCommands(...files: string[]) {
	// @ts-ignore
	existsSync.mockReturnValueOnce(files.length>0);
	// @ts-ignore
	readdirSync.mockReturnValueOnce(files);
}