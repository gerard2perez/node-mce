import chalk from 'chalk';
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
function _range (str) { 
    return str.split('..').map(n => parseInt(n, 10));
 }
function _list (str) { return str.split(','); }
function _collect(val, memo) {
    memo.push(val);
    return memo;
}
function _increaseVerbosity(v, total) {
    return total + 1;
}
export enum Parser {
    float = <any>parseFloat,
    int = <any>parseInt,
    range = <any>_range,
    list = <any>_list,
    collect = <any>_collect,
    increaseVerbosity = <any>_increaseVerbosity,
    string = <any>(s => s.toString()),
    truefalse = <any> (s=> s==="false" ? false : !!s)
}
export type range = [number, number];
export type list = string[];
export interface DataGroup2 { 
    [p:string]: tOptions<number> | tOptions<range> | tOptions<boolean> | tOptions<string> | tOptions<range> | tOptions<list>;
}
export type Parsed<T extends DataGroup2 > = { readonly [P in keyof T]: T[P][5]; }
export type tOptions<T> = [string, string, Parser, RegExp, any, T];
function preOptions<T>(parser:Parser, option:string, description:string, exp:RegExp | any =undefined, defaults:any=undefined) {
    if ( !(exp instanceof RegExp) ) {
        defaults = exp;
        exp = undefined;
    }
    switch(parser) {
        case Parser.increaseVerbosity:
            defaults = 0;
            break;
        case Parser.collect:
        case Parser.list:
        case Parser.range:
            defaults = defaults || [];
            break;
    }
    return [option, description, parser, exp, defaults, undefined] as tOptions<T>;
}

interface OptionBuilder<T> {
    (option:string, description:string, exp:RegExp, defaults?:any) : tOptions<T>;
    (option:string, description:string, defaults?:any) : tOptions<T>;
}
export const numeric: OptionBuilder<number> = preOptions.bind(null, Parser.int)
export const floating: OptionBuilder<number> = preOptions.bind(null, Parser.float)
export const range: OptionBuilder<range> = preOptions.bind(null, Parser.range)
export const text: OptionBuilder<string> = preOptions.bind(null, Parser.string)
export const list: OptionBuilder<list> = preOptions.bind(null, Parser.list)
export const collect: OptionBuilder<list> = preOptions.bind(null, Parser.collect)
export const bool: OptionBuilder<boolean> = preOptions.bind(null, Parser.truefalse)
export const verbose: (desciprtion?:string)=>tOptions<number> = preOptions.bind(null, Parser.increaseVerbosity, '-v')

enum OptionKind {
    no,
    required,
    optional,
    boolean,
    varidac
}
interface ParserCommands {
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
        .replace(/[(.*)]/, `[${chalk.blueBright("$1")}]`);
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
                let arg_len = rawvalue.length + regexp.length;
                rawvalue = chalk.cyan(rawvalue) + chalk.green(regexp);
                
                if(longest < len) longest = len;
                if(longest_arg < arg_len) longest_arg = arg_len;
                options.push( [`\n        ${chalk.cyan(short)}${chalk.gray(tag)}`, desciprtion || '', len, rawvalue, arg_len ]);
                // help += `\n        ${chalk.cyan(short)}${chalk.gray(tag)}`;
            }
            for (let [terminal, desc, len, val, arg_len] of options) {
                let post = '';
                let post_arg = '';
                while(len < longest){post += ' ';len++}
                while(arg_len < longest_arg){post_arg += ' ';arg_len++}
                help += `${terminal}${post} ${val}${post_arg}  ${desc}`;
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
        let matched = parsed.expression ? parsed.expression.exec(args[i + 1]) != null:true;
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
        // } else if(parsed.parser === (Parser.truefalse as any)) {
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
            if(short.includes('--'))short = undefined;
            let tag = `--${key}`;
            this.mappedTags[key] = {
                tags: [tag, short],
                expression,
                defaults,
                parser: parser as any,
                rawvalue: value,
                value: !value ? ( Parser.truefalse === parser ?  OptionKind.boolean: OptionKind.no) : (value.includes("<") ? OptionKind.required : OptionKind.optional)
            };
            if(short) {
                if(this.shortTags[short.replace('-', '')]) {
                    throw new Error(`Duplicated short tag ${short}. This is a problem related to the program.`)
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
