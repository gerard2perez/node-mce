import { existsSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { Command } from "./command";
let ext = process.env.MCE_DEV ? 'ts' : 'js';
class MCE {
	help: boolean = false;
	name: string;
	version: string;
	constructor (private root:string) {
		process.env.MCE_ROOT = root;
		let {version, bin} = require(resolve(root.replace('src', ''), 'package.json'));
		let [name] = Object.keys(bin);
		this.name = name;
		this.version = version;
		process.argv.splice(0, 2);
		if(!process.argv.length || (process.argv.includes('-h') || process.argv.includes('--help')) )
		{
			this.help = true;
		}
		if(this.help) {
			console.log(`${this.name} - version: ${this.version}`);
		}
	}
	private getCommand (source:string, subcommand:string='') {
		let command_name = `${this.name} ${subcommand.replace(`.${ext}`, '')}`.trim();
		let mce_sub_command:Command;
		let mce_definition:any = require(source);
		if(mce_definition.default) {
			mce_sub_command  = (new mce_definition.default(command_name) as Command);
		} else {
			mce_sub_command = new Command(command_name, mce_definition);
		}
		return mce_sub_command;
	}
	async command (args:string[]) {
		let root = resolve(this.root, `index.${ext}`);
		if (!this.help) {
			let exists = existsSync( root );
			if ( !exists ) {
				console.log('Command does not exists');
				return Promise.resolve();
			} else {
				return this.getCommand(root).call(args);
			}
		} else {
			return this.getCommand(root).help();
		}
	}
	async subcommand (args:string[]):Promise<void> {
		let root = resolve(this.root, './commands');
		let [subcommand] = args.splice(0,1);
		let sub = resolve(root, `${subcommand}.${ext}`);
		let exists = existsSync( sub );
		if ( exists ) {
			return this.getCommand(sub, subcommand).call(args);
		} else if (this.help) {
			for(const subcommand of readdirSync(root)) {
				if ( subcommand.search(new RegExp(`.*\.${ext}$`, 'i')) === 0 ) {
					await this.getCommand(resolve(root, subcommand), subcommand).help();
				}
			}
			return Promise.resolve();
		} else {
			console.log('Command does not exists');
			return Promise.resolve();
		}
	}
}
function make (localdir?:string) {
	return new MCE(localdir);
}
// let command = make().subcommand(process.argv);
export {make as MCE};