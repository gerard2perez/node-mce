import chalk from 'chalk';
import { tOptions, Parser } from './options';
import { targetPath } from './paths';
function countmax() {
    let maxvalue = 0;
    return (text: string = '') => {
        if (text.length > maxvalue) maxvalue = text.length;
        return maxvalue;
    };
}
function padding(text: string, len: Function, long?: number) {
    if (long >= 0) {
        let after = '';
        while (long < len()) {
            long++;
            after += ' '
        }
        text += after;
    } else {
        while (text.length < len()) text += ' ';
    }
    return text;
}
export function iter(obj: any) {
    Object.defineProperty(obj, Symbol.iterator, {
        configurable: true,
        value: function () {
            let keys = Object.keys(this);
            let data: any = this;
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
    });
    return obj;
}
enum OptionKind {
    no,
    required,
    optional,
    boolean,
    varidac,
    verbose
}
interface ParserCommands {
    options?: string[],
    rawvalue: string
    tags: string[]
    defaults: any
    expression: RegExp
    parser: Function
    kind: OptionKind
}
class Command {
    private mappedTags: { [p: string]: ParserCommands } = {}
    private shortTags: { [p: string]: ParserCommands } = {}
    constructor(private command: string) { }
    description: string = ''
    options: { [p: string]: tOptions<any> }
    arguments: string = ''
    action(...data: any[]) { }
    call(argv: string[]) {
        if (process.argv.includes('-h') || process.argv.includes('--help')) {
            this.help()
        } else {
            this.execute(argv.join('=').split('=').filter(f => f));
        }
    }
    help() {
        let help = chalk.yellow(`    ${this.command} `);
        help += this.arguments.split(' ').map(this.drawArg).join(' ');
        if (this.options) {
            help += ` ${chalk.cyan('[options]')}`
        }
        let options = [];
        let desc_len = countmax();
        let tags_len = countmax();
        let val_len = countmax();
        let desc_limit = 50;
        if (this.description)
            help += `\n      ${this.description}`;
        for (const [option, [arg, desciprtion, parser, expresion, defaults]] of iter(this.options)) {
            const info = this.mapTags(option, arg, parser, expresion, defaults);
            let [tag, short] = info.tags;
            if (!short) {
                short = tag;
                tag = '';
            } else {
                tag = `, ${tag}`;
            }
            let desc:string = desciprtion || '';
            let rawvalue:string = info.rawvalue || '';
            let len = short.length + tag.length;
            let arg_len = rawvalue.length;

            let split_desc = Math.ceil(desc.length / 2) > desc_limit;
            let parts = this.formatDescription(desc, desc_limit, parser, expresion);
            parts.map(p=>desc_len(p));
            tags_len(short + tag);
            val_len(rawvalue);
            rawvalue = chalk.cyan(rawvalue);
            options.push([`${chalk.cyan(short)}${chalk.gray(tag)}`, parts, len, rawvalue, arg_len, defaults]);
        }
        for (let option of options) {
            help += this.formatOption(option, tags_len, val_len, desc_len);            
        }
        process.stdout.write(help + '\n\n');
    }
    private formatOption(option:any, tags_len, val_len, desc_len) {
        let [tags, desc, tagLen, val, valLen, defaults] = option;
        let def = defaults && (defaults.length || defaults > 0) ? `[${chalk.red(defaults)}]` : '';
        let [main, ...overflow] = desc;
        let argDescription = [`${padding(tags, tags_len, tagLen)} ${padding(val, val_len, valLen)} ${chalk.white(padding(main, desc_len))} ${def}`];
        overflow.map(d=>argDescription.push(`${padding('', tags_len)}  ${padding('', val_len)} ${chalk.white(d)}`))
        return argDescription.map(arg=>`\n        ${arg}`).join('');
    }
    private formatDescription(desc: string, desc_limit: number, parser:Parser, expresion:string[]) {
        let parts:string[] = [];
        let count = 0;
        let index = 0;
        let lines = desc.replace(/ +/gm, ' ').split('\n').map(line=>{
            return line.split(' ');
        }).map(line => {
            for(const word of line) {
                parts[index] = parts[index] || '';
                parts[index] += ` ${word}`;
                if(parts[index].length > desc_limit) {
                    index++;
                }
            }
            index++;
        });
        if( parser === Parser.enum) {
            parts.push(` Values: ${expresion.join(' | ')}`)
        }
        if(parts.length>1)parts.push('');
        return parts;
    }
    private drawArg(arg: string) {
        return arg.replace(/<(.*)>/, `<${chalk.green("$1")}>`)
            .replace(/\[(.*)\]/, `[${chalk.blueBright("$1")}]`);
    }
    private prepare(args: string[]): [any, string[]] {
        let argum: string[] = [];
        let options = {};
        for (const [key, [opt, description, parser, expression, defaults]] of iter(this.options)) {
            let { kind } = this.mapTags(key, opt, parser, expression, defaults);
            options[key] = kind === OptionKind.boolean ? false : defaults;
        }
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            let matched = false;
            for (const [key, [opt, description, parser, expression, defaults]] of iter(this.options)) {
                let parsed = this.mapTags(key, opt, parser, expression, defaults);
                if (parsed.tags.includes(arg)) {
                    matched = true;
                    i = this.extractValue(key, options, i, parsed, args);
                    break;
                }
            }
            if (!matched) argum.push(arg);
        }
        argum = this.repetableShort(argum, options);
        return [options, argum];
    }
    private execute(args: string[]) {
        let [options, argum] = this.prepare(args);
        let final_args = [];
        let main_arguments = this.arguments.split(' ').filter(f => f);
        let main_args = main_arguments.map(this.argInfo);
        for (let i = 0; i < main_args.length; i++) {
            switch (main_args[i]) {
                case OptionKind.required:
                    if (!argum[0]) throw new Error(`Missing argument ${main_arguments[i]}`);
                    final_args.push(argum[0]);
                    argum.splice(0, 1);
                    break;
                case OptionKind.varidac:
                    if (i !== main_args.length - 1) throw new Error(`Varidac argument can only be in last place`);
                    if (main_args[i - 1] === OptionKind.optional) {
                        throw new Error(`Optional argument and Varidac cannot be next to each other`);
                    }
                    final_args.push(argum);
                    break;
                case OptionKind.optional:
                    final_args.push(argum[0])
                    argum.splice(0, 1);
                    break;
            }
        }
        let nargs = final_args.length + 1;
        if (nargs !== this.action.length)
            throw new Error(`Argument count Missmatch, your function should have only ${nargs}`);
        process.env.MCE_VERBOSE = options.verbose;
        this.action(...final_args, options);
    }
    private argInfo(arg: string): OptionKind {
        if (arg.includes('<')) return OptionKind.required;
        if (arg.includes('...')) return OptionKind.varidac;
        return OptionKind.optional;
    }
    private validateValue(expression: RegExp | Array<string>, val: string) {
        let matched = true;
        if (expression instanceof RegExp) {
            matched = expression.exec(val) != null;
        } else if (expression instanceof Array) {
            matched = expression.includes(val);
        }
        return matched;
    }
    private extractValue(key: string, options: any, i: number, parsed: ParserCommands, args: string[]) {
        if (!this.validateValue(parsed.expression, args[i + 1]))
            throw new Error(`Argument '${args[i]} ${args[i + 1]}' does not match expression '${parsed.expression}'`);
        switch (parsed.kind) {
            case OptionKind.required:
                i++;
                if (!args[i] || args[i].includes('-')) throw new Error(`Missing value for argument ${args[i - 1]}`);
                options[key] = parsed.parser(args[i], options[key]);
                break;
            case OptionKind.optional:
                if (args[i + 1] && !args[i + 1].includes('-')) {
                    i++;
                    options[key] = parsed.parser(args[i], options[key]);
                } else {
                    options[key] = parsed.parser(true, options[key]);
                }
                break;
            case OptionKind.boolean:
                options[key] = true;
                break;
            case OptionKind.verbose:
                options[key] = parsed.parser(args[i], options[key]);
                break;
            default:
                console.log(parsed);
                throw new Error('Case not implemented');
        }
        return i;
    }
    private repetableShort(argum: string[], options: any) {
        let res: string[] = [];
        for (let i = 0; i < argum.length; i++) {
            let arg = argum[i];
            let matched = false;
            if (arg.indexOf('-') === 0) {
                arg = arg.replace('-', '');
                for (const t of arg.split('')) {
                    for (const [tag, parsed] of iter(this.shortTags)) {
                        if (t === tag) {
                            matched = true;
                            let key = parsed.tags[0].replace('--', '');
                            i = this.extractValue(key, options, i, parsed, argum);
                            break;
                        }
                    }
                }
            }
            if (!matched) res.push(arg);
        }
        return res;
    }
    private formatTags(key: string, option: string, parser:Parser) {
        let [short='', value=''] = option.split(' ');
        let stagdesc = short;
        if (!short.includes('-')) {
            value = short;
            short = undefined;
        }
        if (short && short.includes('--')) short = undefined;
        let tag = `--${key}`;
        if (key.length === 1) {
            tag = `-${key}`;
            stagdesc = tag;
        }
        tag = tag.replace(/([A-Z])/gm, "-$1").toLowerCase();
        if(!short)stagdesc=undefined;
        if(!value) {
            switch(parser) {
                case Parser.list:
                    value = `<a>,<b>..<n>`;
                    break;
                case Parser.string:
                    // value = `<${key}>`;
                    break;
                case Parser.range:
                    value = '<a>..<b>';
                    break;
                case Parser.collect:
                    value = '<c>';
                    break;
                case Parser.int:
                case Parser.float:
                    value = '<n>';
                    break;
                case Parser.enum:
                    value = '<e>';
                    break;
            }
        }
        return { tag, short, value, stagdesc };
    }
    private mapTags(key: string, arg: string, parser: Parser, expression: RegExp, defaults: any) {
        if (!this.mappedTags[key]) {
            let { tag, short, value, stagdesc } = this.formatTags(key, arg, parser);
            this.mappedTags[key] = {
                tags: [tag, short],
                expression,
                defaults,
                parser: parser as any,
                rawvalue: value,
                kind: !value ? (Parser.truefalse === parser ? OptionKind.boolean : (Parser.increaseVerbosity === parser ? OptionKind.verbose : OptionKind.no)) : (value.includes("<") ? OptionKind.required : OptionKind.optional)
            };
            if (stagdesc) {
                if (this.shortTags[stagdesc.replace('-', '')]) {
                    throw new Error(`On Command: ${this.command}. duplicated short tag ${stagdesc}. This is a problem related to the program.`)
                }
                this.shortTags[stagdesc.replace('-', '')] = this.mappedTags[key];
            }
        }
        return this.mappedTags[key];
    }
}
export { Command, Command as default };
