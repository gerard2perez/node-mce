/**
 * @module @bitsun/mce
 */
import { existsSync, readdirSync } from "fs";
import { resolve } from "path";
import { Command } from "./core/command";
import { MainSpinner } from "./spinner";
import { Option, Parser } from "./core/option";
let ext = process.env.MCE_DEV ? 'ts' : /*istanbul ignore next*/'js';

export class MCEProgram {
	private showHelp: boolean = false;
	private showVersion: boolean = false;
	name: string;
	version: string;
	common:{[p:string]:Option<any>} = {}
	unic_shorts:string[] = []
	verbose:number
	private createBoolVar(option:string) {
		let [short, tag] = option.split(' ');
		let name = (tag||short).replace(/-/g, '');
		this.common[name] = new Option<boolean>(short,'', Parser.truefalse,undefined,false);
		this.common[name].makeTag(name, this);
		return this;
	}
	_version(option:string = '--version') {
		return this.createBoolVar(option);
	}
	_help(option:string = '-h --help') {
		return this.createBoolVar(option);
	}
	_verbose(option:string = '-v') {
		let [short, tag='--verbose'] = option.split(' ');
		this.common.verbose = new Option<number>(short,'', Parser.increaseVerbosity,undefined,0);
		this.common.verbose.makeTag(tag.replace(/-/g, ''),this);
		return this;
	}
	constructor (private root:string) {
		process.env.MCE_ROOT = root;
		let { version, bin } = require(resolve(root.replace('src', ''), 'package.json'));
		let [name] = Object.keys(bin);
		this.name = name;
		this.version = version;
		process.argv.splice(0, 2);
		this._verbose()._help()._version();
	}
	private getCommand (source:string, /*istanbul ignore else */subcommand:string='') {
		let command_name = `${subcommand.replace(`.${ext}`, '')}`.trim();
		let mce_sub_command:Command;
		let mce_definition:any = require(source);
		mce_sub_command = new Command(this.name, command_name, mce_definition);
		mce_sub_command.showHelp = this.showHelp;
		
		return mce_sub_command;
	}
	private findCompressed(args:string[]){
		let composed = [];
		for(let pos=0; pos<args.length; pos++) {
			let arg = args[pos];
			if(/^\-[aA-zZ]{2,}/g.test(arg)) {
				let ps = arg.replace('-','').split('').map(a=>`-${a}`);
				// let pos = args.indexOf(arg);
				let nargs = args.slice(pos+1);
				args.splice(pos, 1);
				for(let i=0; i < ps.length; i++) {
					composed.push(ps[i]);
					if(nargs[0] && !nargs[0].includes('-')){
						composed.push(nargs[0]);
						nargs.splice(0,1);
						args.splice(pos, 1);
					}
				}
				pos--;
			}
		}
		return composed.filter(c=>c);
	}
	prepare(args:string[]) {
		args.splice(-1,0, ...this.findCompressed(args));
		this.showHelp = args.length ===0;
		this.showVersion = this.common.version.find(args) && args.length <= 1;
		// istanbul ignore else
		if(!this.showHelp)this.showHelp = this.common.help.find(args) && args.length <= 1;
		process.env.MCE_VERBOSE = this.common.verbose.find(args);
		if(this.showVersion)MainSpinner.stream.write(this.version);
		return this.showVersion;
	}
	async command (args:string[]) {
		if(this.prepare(args))return;
		let root = resolve(this.root, `index.${ext}`);
		let exists = existsSync( root );
		// istanbul ignore if
		if ( !exists ) {
			MainSpinner.stream.write('Command does not exists\n');
			return Promise.resolve();
		} else {
			let command = this.getCommand(root);
			return command.call(args);
		}
	}
	async subcommand (args:string[]):Promise<void> {
		if(this.prepare(args))return;
		let root = resolve(this.root, './commands');
		let [subcommand] = args.splice(0,1);
		let sub = resolve(root, `${subcommand}.${ext}`);
		let exists = existsSync( sub );
		if ( exists ) {
			return this.getCommand(sub, subcommand).call(args);
		} else if (this.showHelp) {
			for(const subcommand of readdirSync(root)) {
				// istanbul ignore else
				if ( subcommand.search(new RegExp(`.*\.${ext}$`, 'i')) === 0 ) {
					await this.getCommand(resolve(root, subcommand), subcommand).help();
				}
			}
			return Promise.resolve();
		} else {
			MainSpinner.stream.write('Command does not exists\n');
			return Promise.resolve();
		}
	}
}
export function MCE (localdir?:string) {
	return new MCEProgram(localdir);
}
export { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from './core/options';
