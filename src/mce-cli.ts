/* eslint-disable @typescript-eslint/no-var-requires */
import { join, resolve } from 'path'
import { Command, ICommand, Option, Parser } from './legacy_core'
import { callerPath } from './fs'
import { existsSync, readdirSync } from './mockable/fs'
import { locations } from './program'
import { MainSpinner } from './spinner'
const ext = process.env.MCE_DEV ? 'ts' : /*istanbul ignore next*/'js'
type CommandMap = {
	scope: string
	command: string
	location: string
}
/**
 * @deprecated
 */
export class MCEProgram {
	private showHelp = false
	private showVersion = false
	name: string
	version: string
	private common: {[p: string]: Option<any>} = {}
	unic_shorts: string[] = []
	private verbose: number
	private createBoolVar(option: string) {
		const [short, tag] = option.split(' ')
		const name = (tag||short).replace(/-/g, '')
		this.common[name] = new Option<boolean>(short, '', Parser.truefalse, undefined, false)
		this.common[name].makeTag(name, this)
		return this
	}
	private _version(option = '--version') {
		return this.createBoolVar(option)
	}
	private _help(option = '-h --help') {
		return this.createBoolVar(option)
	}
	private _verbose(option = '-v') {
		const [short, tag='--verbose'] = option.split(' ')
		this.common.verbose = new Option<number>(short, '', Parser.increaseVerbosity, undefined, 0)
		this.common.verbose.makeTag(tag.replace(/-/g, ''), this)
		return this
	}
	/**
	 * @deprecated
	 */
	constructor (private root: string) {
		process.env.MCE_ROOT = root.replace('dist', '').replace('src', '')
		const { version, bin } = require(resolve(root.replace('src', '').replace('dist', ''), 'package.json'))
		const [name] = Object.keys(bin)
		this.name = name
		this.version = version
		locations(...process.argv.splice(0, 2) as [string, string])
		this._verbose()._help()._version()
	}
	private loadModule(source: string): ICommand {
		try {
			return require(source)
		} catch(ex) {
			/* istanbul ignore next */
			console.error(ex)
			/* istanbul ignore next */
			return {} as any
		}
	}
	private getCommand (source: ICommand, command_name: string) {
		return new Command(this.name, command_name, source, this.showHelp)
	}
	private findCompressed(args: string[]){
		const composed = []
		for(let pos=0; pos<args.length; pos++) {
			const arg = args[pos]
			if(/^-[aA-zZ]{2,}/g.test(arg)) {
				const ps = arg.replace('-', '').split('').map(a => `-${a}`)
				const nargs = args.slice(pos+1)
				args.splice(pos, 1)
				for(let i=0; i < ps.length; i++) {
					composed.push(ps[i])
					if(nargs[0] && !nargs[0].includes('-')){
						composed.push(nargs[0])
						nargs.splice(0, 1)
						args.splice(pos, 1)
					}
				}
				pos--
			}
		}
		return composed.filter(c => c)
	}
	private prepare(args: string[], single=false) {
		args.splice(-1, 0, ...this.findCompressed(args))
		const force_help = !single && args.length ===0
		this.showVersion = this.common.version.find(args) && args.length <= 1
		// istanbul ignore else
		this.showHelp = force_help || this.common.help.find(args) && args.length <= 1
		process.env.MCE_VERBOSE = this.common.verbose.find(args)
		if(this.showVersion)MainSpinner.stream.write(this.version)
		return this.showVersion
	}
	async command (/* istanbul ignore next */ args: string[] = process.argv) {
		if(this.prepare(args, true))return
		const root = resolve(this.root, `index.${ext}`)
		const exists = existsSync( root )
		// istanbul ignore if
		if ( !exists ) {
			MainSpinner.stream.write('Command does not exists\n')
			return Promise.resolve()
		} else {
			const command = this.getCommand(this.loadModule(root), '')
			return command.call(args)
		}
	}
	/**
	 * @deprecated
	 */
	async gitStyle<T=void> (/* istanbul ignore next */ args: string[] = process.argv): Promise<T> {
		if(this.prepare(args))return
		this.readCommands('', this.root, 'commands').map(c => this.register(c))
		const [subcommand] = args.splice(0, 1)
		const source = this.commandMapping.get(subcommand)
		if(source) {
			return this.getCommand(source, source.name).call(args) as any
		} else if (!subcommand && this.showHelp) {
			const allCommands = [...this.commands_map._owned.sort(), ...this.commands_map._local.sort(), ...this.commands_map.plugins.sort()]
			for(const command of allCommands) {
				const Command = this.commandMapping.get(command)
				await this.getCommand(Command, Command.name).help()
			}
			return Promise.resolve(undefined)
		} else {
			MainSpinner.stream.write('Command does not exists\n')
			return Promise.resolve(undefined)	
		}
	}
	private register(mapping: CommandMap) {
		switch(mapping.scope) {
			case '':
				this.commands_map._owned.push(mapping.command)
				break
			case 'l':
				this.commands_map._local.push(mapping.command)
				break
			default:
				this.commands_map.plugins.push(mapping.command)
				break
		}
		const icommand = this.loadModule(mapping.location)
		icommand.name = mapping.command
		this.commandMapping.set(mapping.command, icommand)
		if(icommand.alias) 
			this.commandMapping.set(icommand.alias, icommand)
	}
	private commands_map = {
		_owned: [],
		_local: [],
		plugins: []
	}
	private commandMapping = new Map<string, ICommand>()
	/**
	 * @deprecated
	 */
	public withPlugins<T=void>(keyword: string, args?: string[] ) {
		this.detectPlugins(keyword).map(c => this.register(c))
		return this.gitStyle<T>(args)
	}
	private detectPlugins(keyword: string): CommandMap[] {
		// istanbul ignore if
		if(!existsSync(callerPath('package.json'))) return[]
		const {dependencies, devDependencies} = require(callerPath('package.json'))
		const packages = Object.keys({...dependencies, ...devDependencies })
		const modules = packages.map(pack => {
			const path = callerPath('node_modules', pack)
			// istanbul ignore if
			if(!existsSync(callerPath('node_modules', pack, 'package.json'))) return {keywords: []}
			/* istanbul ignore next */
			let {keywords = [], name} = require(callerPath('node_modules', pack, 'package.json')) as {name: string, keywords: string[]}
			name = name.split('/').slice(-1)[0].replace('@', '')
			return {
				path,
				name,
				keywords
			}
		})
		.filter(p => {
			
			return p.keywords.includes(keyword)
		})
		.map(path => this.readCommands(path.name, path.path, '@commands'))
		return [].concat.apply([], [this.readCommands('l', callerPath(), `@${keyword}`), ...modules])
	}
	private readCommands(scope: string, path: string, container: string): CommandMap[] {
		const commandsRoot = join(path, container)
		const detected = !existsSync(commandsRoot) ? [] : readdirSync(commandsRoot)
		return detected
		.filter(file => !file.includes('.map') && !file.includes('.d.ts') && !file.includes('@shared'))
		.map(file => {
			const name = file.split('.')
			if(name.length===1) name.push('')
			return {
				scope,
				command: scope ? `${scope}:${name[0]}` : name[0],
				location: join(path, container, name.slice(0, -1).join('.'))
			}
		})
	}
}