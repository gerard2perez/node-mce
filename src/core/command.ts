import chalk from 'chalk';
import { Argument } from './argument';
import { HelpRenderer, ParserCommands } from './help-renderer';
import { OptionKind, Parser, tOptions } from './options';
import { iter } from '../utils';
function countmax() {
    let maxvalue = 0;
    return (text: string = '') => {
        if (text.length > maxvalue) maxvalue = text.length;
        return maxvalue;
    };
}
class Command {
    private mappedTags: { [p: string]: ParserCommands } = {}
    private shortTags: { [p: string]: ParserCommands } = {}
    action:(...data:any[]) => Promise<void>
    constructor(private command: string, definition:any) {
        this.arguments = definition.args || '';
        this.options = definition.options || [];
        this.description = definition.description || '';
        this.action = definition.action;
    }
    description: string = ''
    options: { [p: string]: tOptions<any> }
    arguments: string = ''
    call(argv: string[]) {
        if (process.argv.includes('-h') || process.argv.includes('--help')) {
            return this.help()
        } else {
            return this.execute(argv.join('=').split('=').filter(f => f));
        }
    }
    async help() {
        let help = chalk.yellow(`    ${this.command} `);
        help += this.arguments.split(' ').map(HelpRenderer.drawArg).join(' ');
        // istanbul ignore else
        if (this.options) {
            help += ` ${chalk.cyan('[options]')}`
        }
        let options = [];
        let desc_len = countmax();
        let tags_len = countmax();
        let val_len = countmax();
        let desc_limit = 50;
        // istanbul ignore else
        if (this.description)
            help += `\n      ${this.description}`;
        for (const [option, [arg, desciprtion, parser, expresion, defaults]] of iter(this.options)) {
            const info = this.mapTags(option, arg, parser, expresion, defaults);
            HelpRenderer.renderArguments(info, desciprtion, desc_limit, parser, expresion, desc_len, tags_len, val_len, options, defaults);
        }
        for (let option of options) {
            help += HelpRenderer.formatOption(option, tags_len, val_len, desc_len);            
        }
        process.stdout.write(help + '\n\n');
    }
    private prepareProgramArguments(args: string[]): [any, string[]] {
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
    private verifyArguments () {
        let main_args = this.arguments.split(' ').filter(f => f).map(a=>new Argument(a));
        let no_optional = false;
        for(const argument of main_args) {
            if(argument.kind === OptionKind.optional) {
                no_optional = true;
            } else if (no_optional && argument.kind === OptionKind.required) {
                throw new Error('All required arguments should go befere optional arguments');
            }
        }
        return main_args;
    }
    private mapArgumentsToOptions(main_args:Argument[], argum:string[]) {
        let final_args = [];
        for (let i = 0; i < main_args.length; i++) {
            switch (main_args[i].kind) {
                case OptionKind.required:
                    if (!argum[0]) throw new Error(`Missing argument ${main_args[i].name}`);
                    final_args.push(main_args[i].parser(argum[0]));
                    argum.splice(0, 1);
                    break;
                case OptionKind.varidac:
                    if (i !== main_args.length - 1) throw new Error(`Varidac argument can only be in last place`);
                    if (main_args[i - 1].kind === OptionKind.optional) {
                        throw new Error(`Optional Argument and Varidac cannot be next to each other`);
                    }
                    final_args.push(main_args[i].parser(argum));
                    break;
                case OptionKind.optional:
                    final_args.push(main_args[i].parser(argum[0]))
                    argum.splice(0, 1);
                    break;
            }
        }
        return final_args;
    }
    private execute(args: string[]) {
        let main_args = this.verifyArguments();
        let [options, argum] = this.prepareProgramArguments(args);
        let final_args = this.mapArgumentsToOptions(main_args, argum);
        let nargs = final_args.length + 1;
        if (nargs !== this.action.length)
            throw new Error(`Argument count missmatch, your function should have only ${nargs}`);
        process.env.MCE_VERBOSE = options.verbose;
        return this.action(...final_args, options);
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
                options[key] = parsed.parser(true);
                break;
            case OptionKind.verbose:
                options[key] = parsed.parser(args[i], options[key]);
                break;
        }
        return i;
    }
    private repetableShort(user_arguments: string[], options: any) {
        let res: string[] = [];
        for (let index = 0; index < user_arguments.length; index++) {
            let current_argument = user_arguments[index];
            let matched = false;
            if (current_argument.indexOf('-') === 0) {
                current_argument = current_argument.replace('-', '');
                for (const short_tag of current_argument.split('')) {
                    ([index, matched] = this.findRepeateableArgument(short_tag, options, index, user_arguments));
                }
            }
            if (!matched) res.push(current_argument);
        }
        return res;
    }
    private findRepeateableArgument(short_tag:string, options:any, index:number, user_arguments:string[] ): [number, boolean] {
        for (const [tag, parsed] of iter(this.shortTags)) {
            if (short_tag === tag) {
                let key = parsed.tags[0].replace('--', '');
                return [this.extractValue(key, options, index, parsed, user_arguments), true];
            }
        }
        return [index, false];
    }
    private mapTags(key: string, arg: string, parser: Parser, expression: RegExp, defaults: any) {
        if (!this.mappedTags[key]) {
            let { tag, short, value, stagdesc } = HelpRenderer.formatTags(key, arg, parser);
            this.mappedTags[key] = {
                tags: [tag, short],
                expression,
                defaults,
                parser: parser as any,
                rawvalue: value,
                kind: !value ? (Parser.truefalse === parser ? OptionKind.boolean : (Parser.increaseVerbosity === parser ? OptionKind.verbose :/* istanbul ignore next */ OptionKind.no)) : (value.includes("<") ? OptionKind.required : OptionKind.optional)
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
