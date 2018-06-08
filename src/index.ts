import { existsSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { Command } from "./command";

let {version, bin} = require(join(__dirname.replace('src', ''), 'package.json'));
let [name] = Object.keys(bin);
class MCE {
	help: boolean;   
	name: string;
	version: string;
	constructor (private localdir:string) {
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
	command () {

	}
	subcommand (args:string[]) {
		if (!this.help) {
			let [subcommand] = args.splice(0,1);
			let sub = resolve(`./commands/${subcommand}.js`); 
			let exists = existsSync( sub );
			if ( !exists ) {
				console.log('Command does not exists');
			} else {
				return this.getCommand(`./commands/${subcommand}`, subcommand).call(args);
			}
		} else {
			for(const subcommand of readdirSync('./commands')) {
				if ( subcommand.search(/.*\.js$/i) === 0 ) {
					this.getCommand(resolve(`./commands/${subcommand}`), subcommand).help();
				}
			}
		}
	}
}
function make (localdir?:string) {
	return new MCE(localdir);
}
// let command = make().subcommand(process.argv);
export {make as MCE};