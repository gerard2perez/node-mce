import chalk from 'chalk';
import { tOptions, Parser } from './options';
declare global {
	interface Object {
		[Symbol.iterator]:() => Iterator<[string, any, number, number]>
	}
}
Object.defineProperty(Object.prototype, Symbol.iterator, {
	value: function() {
		let keys = Object.keys(this);
		let data:any = this;
		let total = keys.length;
		return {
			i: 0,
			next() {
				let current = this.i;
				let key = keys[current];
				return {
					value: [
						key,
						data[key],
						current,
						total
					],
					done: this.i++ === total
				};
			}
		};
	}
})

enum OptionKind {
    no,
    required,
    optional,
    boolean,
    varidac
}
interface ParserCommands {
    options?:string[],
    rawvalue:string
    tags:string[]
    defaults:any
    expression:RegExp
    parser:Function
    value:OptionKind
}
class Command {
    constructor(private command:string) {}
    description:string = ''
    options: {[p:string]:tOptions<any>}
    mappedTags: {[p:string]:ParserCommands} = {}
    shortTags:  {[p:string]:ParserCommands} = {}
    arguments:string = ''
    call (argv:string[]) {
        if ( process.argv.includes('-h') || process.argv.includes('--help') ) {
            this.help()
        } else {
            this.execute(argv);
        }

    }
    drawArg(arg:string) {
        return arg.replace(/<(.*)>/, `<${chalk.green("$1")}>`)
            .replace(/\[(.*)\]/, `[${chalk.blueBright("$1")}]`);
    }
    help() {
        let help = chalk.yellow( `    ${this.command} `);
        help += this.arguments.split(' ').map(this.drawArg).join(' ');
        if(this.options) {
            help += ` ${chalk.cyan('[options]')}`
        }
        let options = [];
        let longest = 0;
        let longest_arg = 0;
        if (this.description)
            help += `\n      ${this.description}`;
            for ( const [option, [arg, desciprtion, parser, expresion, defaults]] of this.options) {
                const info = this.getTags(option, arg, parser,expresion, defaults);
                let [tag, short] = info.tags;
                if(!short) {
                    short = tag;
                    tag = '';
                } else {
                    tag = `, ${tag}`;
                }
                let rawvalue = info.rawvalue || '';
                let regexp = ' ' + ( (`${expresion}` || '').split('/')[1] || '').replace(/\^|\$/gi, '')
                let len = short.length + tag.length;
                let arg_len = rawvalue.length; // + regexp.length;
                rawvalue = chalk.cyan(rawvalue); // + chalk.green(regexp);
                
                if(longest < len) longest = len;
                if(longest_arg < arg_len) longest_arg = arg_len;
                options.push( [`\n        ${chalk.cyan(short)}${chalk.gray(tag)}`, desciprtion || '', len, rawvalue, arg_len, defaults ]);
                // help += `\n        ${chalk.cyan(short)}${chalk.gray(tag)}`;
            }
            for (let [terminal, desc, len, val, arg_len, defaults] of options) {
                let post = '';
                let post_arg = '';
                while(len < longest){post += ' ';len++}
                while(arg_len < longest_arg){post_arg += ' ';arg_len++}
                let def = defaults && defaults.length ? `[${chalk.red(defaults)}]` : '';
                help += `${terminal}${post} ${val}${post_arg}  ${chalk.white(desc)}. ${def}`;
            }
        process.stdout.write(help+'\n\n');
    }
    execute (args:string[]) {
        let argum:string[] = [];
        let options:any = {};
        for(let i = 0; i<args.length; i ++) {
            let arg = args[i];
            let matched = false;
            for( const [key, [opt, description, parser, expression, defaults]] of this.options) {
                let parsed = this.getTags(key, opt, parser, expression, defaults);
                if( parsed.tags.includes( arg )) {
                    matched = true;
                    i = this.extractValue(key,options, i, parsed, args);
                    break;
                }
            }
            if (!matched) argum.push(arg);
        }
        argum = this.repetableShort(argum, options);
        for(const [key, {value}] of this.mappedTags) {
            if (value === OptionKind.boolean && !options[key]) {
                options[key] = false
            }
        }
        let final_args = [];
        let main_arguments = this.arguments.split(' ');
        let main_args = main_arguments.map(this.argInfo);
        for(let i=0; i<main_args.length; i++) {
            if(main_args[i] === OptionKind.required) {
                if(!argum[0])throw new Error(`Missing argument ${main_arguments[i]}`);
                final_args.push(argum[0])
                argum.splice(0,1);
            } else if (main_args[i] === OptionKind.varidac) {
                if ( i !== main_args.length - 1)throw new Error(`Varidac argument can only be in last place`);
                if(main_args[i - 1] === OptionKind.optional) {
                    throw new Error(`Optional argument and Varidac cannot be next to each other`);
                }
                final_args.push(argum);
                break;
            } else if (main_args[i] === OptionKind.optional) {
                final_args.push(argum[0])
                argum.splice(0,1);
            }
        }
        let nargs = final_args.length + 1;
        if(nargs !== this.action.length)
            throw new Error(`Argument count Mmssmatch, your function should have only ${nargs}`);
        process.env.MCE_VERBOSE = options.verbose || 0;
        this.action( ...final_args, options);
    }
    private argInfo(arg:string) : OptionKind {
        if(arg.includes('<')) return OptionKind.required;
        if(arg.includes('...'))return OptionKind.varidac;
        return OptionKind.optional;
    }
    private extractValue(key:string, options:any, i:number, parsed: ParserCommands, args:string[]) {
        options[key] = options[key] || parsed.defaults;
        let matched = false;
        if (parsed.expression && parsed.expression instanceof RegExp) {
            matched = parsed.expression ? parsed.expression.exec(args[i + 1]) != null:true;
        } else if (parsed.expression && parsed.expression instanceof Array) {
            matched = parsed.expression.includes(args[i+1]);
        }
        if(parsed.value == OptionKind.required) {
            i++;
            if(!args[i] || args[i].includes('-'))throw new Error(`Missing value for argument ${args[i - 1]}`);
            options[key] = parsed.parser(args[i], options[key]);
        } else if(parsed.value == OptionKind.optional) {
            if(args[i + 1] && !args[i + 1].includes('-')) {
                i++;
                options[key] = parsed.parser(args[i], options[key]);
            } else {
                options[key] = parsed.parser(true, options[key]);
            }
        } else if(key === 'verbose') {
            options[key] = parsed.parser(args[i], options[key]);
        } else if (parsed.value === OptionKind.boolean) {
            options[key] = true;
        } else {
            console.log(parsed);
            throw new Error('Case not implemented');
        }
        if(!matched)
            throw new Error(`Argument '${args[i]}' does not match expression '${parsed.expression}'`);
        return i;
    }
    private repetableShort(argum:string[], options:any) {
        let res:string[] = [];
        for(let i =0; i<argum.length; i++) {
            let arg = argum[i];
            let matched = false;
            if( arg.indexOf('-') === 0 ) {
                arg = arg.replace('-', '');
                for(const t of arg.split('')) {
                    for(const [tag, parsed ] of this.shortTags) {
                        if(t === tag) {
                            matched = true;
                            let key = parsed.tags[0].replace('--', '');
                            i = this.extractValue(key, options, i, parsed, argum );
                            break;
                        }
                    }
                }
            }
            if (!matched) res.push(arg);
        }
        return res;
    }
    private getTags(key:string, arg:string, parser:Parser, expression:RegExp, defaults:any) {
        if(!this.mappedTags[key]) {
            let [short, value] = arg.split(' ');
            if(!short.includes('-')) {
                value = short;
                short = undefined;
            }
            if(short && short.includes('--'))short = undefined;
            let tag = `--${key}`;
            if ( short || key.length === 1) {
                tag = `-${key}`;
            }
            // let tag = short ? `--${key}` : `-${key}`;
            this.mappedTags[key] = {
                tags: [tag, short],
                // options: (expression instanceof Array ? expression:undefined),
                // expression: (expression instanceof Array ? undefined:expression),
                expression,
                defaults,
                parser: parser as any,
                rawvalue: value,
                value: !value ? ( Parser.truefalse === parser ?  OptionKind.boolean: OptionKind.no) : (value.includes("<") ? OptionKind.required : OptionKind.optional)
            };
            if(short) {
                if(this.shortTags[short.replace('-', '')]) {
                    throw new Error(`On Command: ${this.command}. duplicated short tag ${short}. This is a problem related to the program.`)
                }
                this.shortTags[short.replace('-', '')] = this.mappedTags[key]; 
            }
            // .push([short.replace('-', ''), this.mappedTags[key].value]);
        }
        return this.mappedTags[key];
        
    }
    action( ...data:any[]) {}
}
export { Command, Command as default } ;
