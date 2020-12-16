/**
 * @module @gerard2p/mce
 */
import { join, resolve } from "path";
import { Command, ICommand, Option, Parser } from "./core";
import { existsSync, readdirSync } from "./fs";
import { locations } from "./program";
import { MainSpinner } from "./spinner";
import { callerPath } from "./tree-maker/fs";
let ext = process.env.MCE_DEV ? 'ts' : /*istanbul ignore next*/'js';
type CommandMap = {
	scope: string
	command: string
	location: string
}
export class MCEProgram {
	private showHelp: boolean = false;
	private showVersion: boolean = false;
	name: string;
	version: string;
	private common:{[p:string]:Option<any>} = {}
	unic_shorts:string[] = []
	private verbose:number
	private createBoolVar(option:string) {
		let [short, tag] = option.split(' ');
		let name = (tag||short).replace(/-/g, '');
		this.common[name] = new Option<boolean>(short,'', Parser.truefalse,undefined,false);
		this.common[name].makeTag(name, this);
		return this;
	}
	private _version(option:string = '--version') {
		return this.createBoolVar(option);
	}
	private _help(option:string = '-h --help') {
		return this.createBoolVar(option);
	}
	private _verbose(option:string = '-v') {
		let [short, tag='--verbose'] = option.split(' ');
		this.common.verbose = new Option<number>(short,'', Parser.increaseVerbosity,undefined,0);
		this.common.verbose.makeTag(tag.replace(/-/g, ''),this);
		return this;
	}
	constructor (private root:string) {
		process.env.MCE_ROOT = root.replace('dist', '').replace('src', '');
		let { version, bin } = require(resolve(root.replace('src', '').replace('dist', ''), 'package.json'));
		let [name] = Object.keys(bin);
		this.name = name;
		this.version = version;
		locations(...process.argv.splice(0, 2) as [string, string]);
		this._verbose()._help()._version();
	}
	private loadModule(source: string): ICommand {
		try {
			return require(source);
		} catch(ex) {
			/* istanbul ignore next */
			console.error(ex);
			/* istanbul ignore next */
			return {} as any;
		}
	}
	private getCommand (source:ICommand, command_name:string) {
		let mce_sub_command:Command;
		mce_sub_command = new Command(this.name, command_name, source, this.showHelp);
		return mce_sub_command;
	}
	private findCompressed(args:string[]){
		let composed = [];
		for(let pos=0; pos<args.length; pos++) {
			let arg = args[pos];
			if(/^\-[aA-zZ]{2,}/g.test(arg)) {
				let ps = arg.replace('-','').split('').map(a=>`-${a}`);
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
	private prepare(args:string[], single:boolean=false) {
		args.splice(-1,0, ...this.findCompressed(args));
		let force_help = !single && args.length ===0;
		this.showVersion = this.common.version.find(args) && args.length <= 1;
		// istanbul ignore else
		this.showHelp = force_help || (this.common.help.find(args) && args.length <= 1);// && !single;
		process.env.MCE_VERBOSE = this.common.verbose.find(args);
		if(this.showVersion)MainSpinner.stream.write(this.version);
		return this.showVersion;
	}
	async command (args:string[] = process.argv) {
		if(this.prepare(args, true))return;
		let root = resolve(this.root, `index.${ext}`);
		let exists = existsSync( root );
		// istanbul ignore if
		if ( !exists ) {
			MainSpinner.stream.write('Command does not exists\n');
			return Promise.resolve();
		} else {
			let command = this.getCommand(this.loadModule(root), '');
			return command.call(args);
		}
	}
	/**
	 * 
	 * @deprecated use gitStyle instead
	 */
	/* istanbul ignore next */
	async subcommand(args:string[] = process.argv):Promise<void> {
		return this.gitStyle(args);
	}
	async gitStyle (args:string[] = process.argv):Promise<void> {
		if(this.prepare(args))return;
		this.readCommands('', this.root, 'commands').map(c => this.register(c))
		let [subcommand] = args.splice(0,1);
		let source = this.commandMapping.get(subcommand);
		if(source) {
			return this.getCommand(source, source.name).call(args);
		} else if (!subcommand && this.showHelp) {
			let allCommands = [...this.commands_map._owned.sort(), ...this.commands_map._local.sort(), ...this.commands_map.plugins.sort()]
			for(const command of allCommands) {
				const Command = this.commandMapping.get(command);
				await this.getCommand(Command, Command.name).help();
			}
			return Promise.resolve();
		} else {
			MainSpinner.stream.write('Command does not exists\n');
			return Promise.resolve();	
		}
	}
	private register(mapping: CommandMap) {
		switch(mapping.scope) {
			case '':
				this.commands_map._owned.push(mapping.command);
				break;
			case 'l':
				this.commands_map._local.push(mapping.command);
				break;
			default:
				this.commands_map.plugins.push(mapping.command);
				break;
		}
		let icommand = this.loadModule(mapping.location);
		icommand.name = mapping.command;
		this.commandMapping.set(mapping.command, icommand);
		if(icommand.alias) 
			this.commandMapping.set(icommand.alias, icommand);
	}
	private commands_map = {
		_owned: [],
		_local: [],
		plugins: []
	}
	private commandMapping = new Map<string, ICommand>();
	/**
	 * 
	 * @deprecated use withPlugins instead
	 */
	/* istanbul ignore next */
	public submodules(keyword: string, args?: string[] ) {
		this.detectPlugins(keyword).map(c=>this.register(c));
		return this;
	}
	public withPlugins(keyword: string, args?: string[] ) {
		this.detectPlugins(keyword).map(c=>this.register(c));
		return this.subcommand(args);
	}
	private detectPlugins(keyword: string): CommandMap[] {
		if(!existsSync(callerPath('package.json'))) return[]
		let {dependencies, devDependencies} = require(callerPath('package.json'));
		let packages = Object.keys({...dependencies, ...devDependencies });
		let modules = packages.map(pack => {
			const path = callerPath('node_modules', pack);
			let {keywords = [], name} = require(callerPath('node_modules', pack, 'package.json')) as {name:string, keywords: string[]};
			name = name.split('/').slice(-1)[0].replace('@', '');
			return {
				path,
				name,
				keywords
			};
		})
		.filter(p=>{
			
			return p.keywords.includes(keyword);
		})
		.map(path => this.readCommands(path.name, path.path, '@commands'));
		return [].concat.apply([], [this.readCommands('l', callerPath(), `@${keyword}`), ...modules]);
	}
	private readCommands(scope: string, path: string, container: string): CommandMap[] {
		let commandsRoot = join(path, container);
		return !existsSync(commandsRoot) ? [] : readdirSync(commandsRoot)
		.filter(file => (!file.includes('.map') && !file.includes('.d.ts')))
		.map(file=>{
			let name = file.split('.');
			if(name.length===1) name.push('');
			return {
				scope,
				command: scope ? `${scope}:${name[0]}` : name[0],
				location: join(path, container, name.slice(0, -1).join('.'))
			}
		});
	}
}
export function MCE (localdir?:string) {
	return new MCEProgram(localdir);
}
export { bool, collect, enumeration, floating, list, numeric, Parsed, range, text, verbose } from './core/options';
export { information } from './program';
export { callerPath, cliPath } from './tree-maker/fs';

