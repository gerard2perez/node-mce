/**
 * @module @gerard2p/mce
 */
import { existsSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { Command, Option, Parser } from "./core";
import { MainSpinner } from "./spinner";
import { targetPath } from "./paths";
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
		let { version, bin } = require(resolve(root.replace('src', '').replace('dist', ''), 'package.json'));
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
		mce_sub_command = new Command(this.name, command_name, mce_definition, this.showHelp);
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
	private findCommands(){
		let commands = Object.assign({}, this.submodule_configuration, {})
		let root = join(this.root, './commands');
		let raw_routes = readdirSync(root).filter(route=>route.search(new RegExp(`.*\.${ext}$`, 'i')) === 0);
		for(let route of raw_routes) {
			let command = route.replace(/\.[t|j]s/m, '');
			commands[command] = resolve(root, route);
		}
		let sorted = {};
		Object.keys(commands).sort().map(c=>(sorted[c] = commands[c]));
		return sorted as {[command:string]:string};
	}
	prepare(args:string[], single:boolean=false) {
		args.splice(-1,0, ...this.findCompressed(args));
		let force_help = !single && args.length ===0;
		this.showVersion = this.common.version.find(args) && args.length <= 1;
		// istanbul ignore else
		this.showHelp = force_help || (this.common.help.find(args) && args.length <= 1);// && !single;
		process.env.MCE_VERBOSE = this.common.verbose.find(args);
		if(this.showVersion)MainSpinner.stream.write(this.version);
		return this.showVersion;
	}
	async command (args:string[]) {
		if(this.prepare(args, true))return;
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
		let commands = this.findCommands();
		let [subcommand] = args.splice(0,1);
		let source = commands[subcommand];
		if(source) {
			return this.getCommand(source, subcommand).call(args);
		} else if (!subcommand && this.showHelp) {
			for(const command of Object.keys(commands)) {
				await this.getCommand(commands[command], command).help();
			}
			return Promise.resolve();	
		} else {
			MainSpinner.stream.write('Command does not exists\n');
			return Promise.resolve();	
		}
	}
	submodule_configuration:any
	public submodules(config_file:string) {
		let configuration = targetPath(config_file);
		this.submodule_configuration = {};
		if(existsSync(configuration)) {
			let config = require(configuration).commands;
			for(const command of Object.keys(config)) {
				let location = targetPath(config[command]);
				if(!existsSync(location)){
					// istanbul ignore next
					location = targetPath('node_modules', config[command]);
				}
				this.submodule_configuration[command] = location;
				console.log(location);
				
			}	
		}
		return this;
	}
}
export function MCE (localdir?:string) {
	return new MCEProgram(localdir);
}
export { bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from './core/options';