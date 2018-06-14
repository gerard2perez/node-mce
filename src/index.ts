import { existsSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { Command } from "./command";

class MCE {
	help: boolean;   
	name: string;
	version: string;
	constructor (private root:string) {
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
		let mce_sub_command:any = require(source).default;
		return (new mce_sub_command(`${this.name} ${subcommand.replace('.js', '')}`.trim()) as Command);
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
		if ( exists ) {
			this.getCommand(sub, subcommand).call(args);
		} else if (this.help) {
			for(const subcommand of readdirSync(root)) {
				if ( subcommand.search(/.*\.js$/i) === 0 ) {
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