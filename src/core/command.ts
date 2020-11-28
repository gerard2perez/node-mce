/**
 * @module @gerard2p/mce/core
 */
import * as chalk from 'chalk';
import { MainSpinner } from '../spinner';
import { Argument } from './argument';
import { HelpRenderer } from './help-renderer';
import { Option, OptionKind } from './option';
/**
 * Rendering help need some fixed spaces between tags, short tags, descriptions
 * This function helps to keep track of the maximun length for those sections
 */
function countMaxLength() {
    let maxvalue:number = 0;
    return (text: string = '') => {
        if (text.length > maxvalue) maxvalue = text.length;
        return maxvalue;
    };
}
export interface ICommand {
	name?: string;
	alias?: string;
	ignore:boolean
	options?:{ [p: string]: Option<any> }
	args?:string
	description?:string
	action:any
}
export class Command {
	alias?: string
	ignoreFromHelp:boolean = false
	showHelp:boolean = false

	verbose:boolean
    action:(...data:any[]) => Promise<void>
    constructor(private program:string, public name: string, definition:ICommand, show_help:boolean) {
		definition = Object.assign({}, {
			description: '',
			args: '',
			options:{},
			ignore:false
		}, definition);
		this.alias = definition.alias;
        this.arguments = this.buildArguments(definition.args);
		this.options = Object.keys(definition.options).map(tag=>definition.options[tag].makeTag(tag, this));
        this.description = definition.description;
		this.action = definition.action;
		this.verbose = !!definition.options.verbose;
		this.ignoreFromHelp = definition.ignore;
		this.showHelp = show_help;
    }
    description: string = ''
    options: Option<any>[]
	arguments: Argument[]
	unic_shorts:string[] = []
    call(argv: string[]) {
        if (this.showHelp) {
            return this.help();
        } else {
            return this.execute(argv.join('=').split('=').filter(f => f));
        }
    }
    async help() {
		// istanbul ignore next
		if(this.ignoreFromHelp)return;
		let alias = this.alias ? `\n      Alias: ${chalk.yellow(this.alias)}` : '';
        let help = chalk.yellow(`    ${this.program} ${this.name} `);
		help += this.arguments.map(a=>HelpRenderer.drawArg(a)).join(' ');
        // istanbul ignore else
        if (this.options.length) {
            help += ` ${chalk.cyan('[options]')}`
        }
        let options = [];
        let desc_len = countMaxLength();
        let tags_len = countMaxLength();
        let val_len = countMaxLength();
        let desc_limit = 50;
        // istanbul ignore else
        if (this.description)
			help += alias + `\n      ${this.description}`;
		for(const option of this.options) {
			options.push(HelpRenderer.renderOptions(option, desc_limit, desc_len, tags_len, val_len));
		}
        for (let option of options) {
            help += HelpRenderer.formatOption(option, tags_len, val_len, desc_len);
		}
		help = help.split('\n').map(line=>line.trimRight()).join('\n');
        MainSpinner.stream.write(help + '\n\n');
    }
    private buildArguments (args:string) {
        let main_args = args.split(' ').filter(f => f).map(a=>new Argument(a));
        let no_optional = false;
        for(const argument of main_args) {
			let i = main_args.indexOf(argument);
            if(argument.kind === OptionKind.optional) {
				no_optional = true;
			} else if (argument.kind === OptionKind.varidac) {
				if (i !== main_args.length - 1)
					throw new Error(`Varidac argument can only be in last place`);
				if (main_args[i - 1] && main_args[i - 1].kind === OptionKind.optional)
					throw new Error(`Optional Argument and Varidac cannot be next to each other`);
            } else if (no_optional && argument.kind === OptionKind.required) {
                throw new Error('All required arguments should go befere optional arguments');
            }
        }
        return main_args;
    }
    private execute(args: string[]) {
		let _opt_:any = {};
		this.options.forEach(option=>(_opt_[option.name] = option.find(args)));
		if(this.verbose) {
			_opt_.verbose = parseInt(process.env.MCE_VERBOSE);
		}
		let final_args = this.arguments.map(a=>a.find(args));
		let nargs = final_args.length + (this.options.length ? 1:0);
        if (nargs !== this.action.length)
            throw new Error(`Argument count missmatch, your function should have only ${nargs}`);
        return this.action(...final_args, _opt_);
    }
}
