import { existsSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { Command } from "./command";

class MCE {
	help: boolean;   
	name: string;
	version: string;
	constructor (private root:string) {
		process.env.MCE_ROOT = root;
		let {version, bin} = require(join(this.root.replace('src', ''), 'package.json'));
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
		let command_name = `${this.name} ${subcommand.replace('.js', '')}`.trim();
		let mce_sub_command:Command;
		let mce_definition:any = require(source);
		if(mce_definition.default) {
			mce_sub_command  = (new mce_definition.default(command_name) as Command);
		} else {
			mce_sub_command = new Command(command_name);
			mce_sub_command.arguments = mce_definition.args || '';
			mce_sub_command.options = mce_definition.options || [];
			mce_sub_command.description = mce_definition.description || '';
			mce_sub_command.action = mce_definition.action;
		}
		return mce_sub_command;
	}
	command (args:string[]) {
		let root = resolve(this.root);
		if (!this.help) {
			let [subcommand] = args.splice(0,1);
			let exists = existsSync( root );
			if ( !exists ) {
				console.log('Command does not exists');
			} else {
				return this.getCommand(root).call(args);
			}
		} else {
			this.getCommand(root).help();
		}
	}
	subcommand (args:string[]) {
		let root = resolve(this.root, './commands');
		let [subcommand] = args.splice(0,1);
		let sub = resolve(root, `${subcommand}.js`);
		let exists = existsSync( sub );
		if(!exists) {
			sub = resolve(root, `${subcommand}.ts`);
			exists = existsSync( sub );
		}
		if ( exists ) {
			this.getCommand(sub, subcommand).call(args);
		} else if (this.help) {
			for(const subcommand of readdirSync(root)) {
				if ( subcommand.search(/.*\.js|ts$/i) === 0 ) {
					this.getCommand(resolve(root, subcommand), subcommand).help();
				}
			}
		} else {
			console.log('Command does not exists');
		}
	}
}
function make (localdir?:string) {
	return new MCE(localdir);
}
// let command = make().subcommand(process.argv);
export {make as MCE};