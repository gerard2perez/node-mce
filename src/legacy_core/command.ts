/**
 * @module @gerard2p/mce/core
 */
import chalk from 'chalk'
import { UseSourceMaps } from '../@utils/user-sourcemaps'
import { MainSpinner } from '../spinner'
import { Argument } from './argument'
import { HelpRenderer } from './help-renderer'
import { Option, OptionKind, Parser } from './option'
/**
 * Rendering help need some fixed spaces between tags, short tags, descriptions
 * This function helps to keep track of the maximun length for those sections
 */
function countMaxLength() {
    let maxvalue = 0
    return (text = '') => {
        if (text.length > maxvalue) maxvalue = text.length
        return maxvalue
    }
}
export interface ICommand {
	name?: string;
	alias?: string;
	ignore: boolean
	options?: { [p: string]: Option<any> }
	args?: string
	description?: string
	action: any
}
export class Command {
	alias?: string
	ignoreFromHelp = false
	showHelp = false

	verbose: boolean
    action: (...data: any[]) => Promise<void>
    constructor(private program: string, public name: string, definition: ICommand, show_help: boolean) {
		definition = Object.assign({}, {
			description: '',
			args: '',
			options: {},
			ignore: false
		}, definition)
		this.alias = definition.alias
        this.arguments = this.buildArguments(definition.args)
		this.options = Object.keys(definition.options).map(tag => definition.options[tag].makeTag(tag, this))
		if(show_help) {
			this.unic_shorts.splice(0, 1)
			this.options.push(new Option<boolean>('-h', 'displays help for the command', Parser.truefalse, undefined, false).makeTag('help', this))
		}
        this.description = definition.description
		this.action = definition.action
		this.verbose = !!definition.options.verbose
		this.ignoreFromHelp = definition.ignore
		this.showHelp = show_help
    }
    description = ''
    options: Option<any>[]
	arguments: Argument[]
	unic_shorts: string[] = ['-h']
    call(argv: string[]) {
        if (this.showHelp) {
            return this.help()
        } else {
            return this.execute(argv.join('=').split('=').filter(f => f))
        }
    }
    async help() {
		// istanbul ignore next
		if(this.ignoreFromHelp)return
		const alias = this.alias ? `\n      Alias: ${chalk.yellow(this.alias)}` : ''
        let help = chalk.yellow(`    ${this.program} ${this.name} `)
		help += this.arguments.map(a => HelpRenderer.drawArg(a)).join(' ')
        // istanbul ignore else
        if (this.options.length) {
            help += ` ${chalk.cyan('[options]')}`
        }
        const options = []
        const desc_len = countMaxLength()
        const tags_len = countMaxLength()
        const val_len = countMaxLength()
        const desc_limit = 50
        // istanbul ignore else
        if (this.description)
			help += alias + `\n      ${this.description}`
		for(const option of this.options) {
			options.push(HelpRenderer.renderOptions(option, desc_limit, desc_len, tags_len, val_len))
		}
        for (const option of options) {
            help += HelpRenderer.formatOption(option, tags_len, val_len, desc_len)
		}
		help = help.split('\n').map(line => line.trimRight()).join('\n')
        MainSpinner.stream.write(help + '\n\n')
    }
    private buildArguments (args: string) {
        const main_args = args.split(' ').filter(f => f).map(a => new Argument(a))
        let no_optional = false
        for(const argument of main_args) {
			const i = main_args.indexOf(argument)
            if(argument.kind === OptionKind.optional) {
				no_optional = true
			} else if (argument.kind === OptionKind.varidac) {
				if (i !== main_args.length - 1)
					throw new Error('Varidac argument can only be in last place')
				if (main_args[i - 1] && main_args[i - 1].kind === OptionKind.optional)
					throw new Error('Optional Argument and Varidac cannot be next to each other')
            } else if (no_optional && argument.kind === OptionKind.required) {
                throw new Error('All required arguments should go befere optional arguments')
            }
        }
        return main_args
    }
    private execute(args: string[]) {
		const debug = process.env.MCE_TRACE === 'true'
		const _opt_: any = {}
		this.options.forEach(option => _opt_[option.name] = option.find(args))
		if(this.verbose) {
			_opt_.verbose = parseInt(process.env.MCE_VERBOSE)
		}
		if(_opt_.dryRun) {
			process.env.MCE_DRY_RUN = 'true'
		}
		const final_args = this.arguments.map(a => a.find(args))
		const nargs = final_args.length + (this.options.length ? 1:0)
        if (nargs !== this.action.length)
            throw new Error(`Argument count missmatch, your function should have only ${nargs}`)
		return this.action(...final_args, _opt_)
			.catch(async error => {
				error = debug ? await UseSourceMaps(error) : error
				throw error
			})
    }
}
