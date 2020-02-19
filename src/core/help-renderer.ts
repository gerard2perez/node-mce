import * as chalk from 'chalk';
import { Parser, OptionKind, Option } from './option';
import { Argument } from './argument';
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
export class HelpRenderer {
    static formatOption(option:any, tags_len, val_len, desc_len) {
		let [tags, desc, tagLen, val, valLen, defaults] = option;
        let def = defaults && (defaults.length || defaults > 0) ? `[${chalk.red(defaults)}]` : '';
        let [main, ...overflow] = desc;
		let argDescription = [`${padding(tags, tags_len, tagLen)} ${padding(val, val_len, valLen)} ${chalk.white(padding(main, desc_len).trimRight())} ${def}`];
		overflow.map(d=>argDescription.push(`${padding('', tags_len)}  ${padding('', val_len)} ${chalk.white(d)}`))
        return argDescription.map(arg=>`\n        ${arg}`).join('');
    }
    static formatDescription(desc: string, desc_limit: number, parser:Parser, expresion:string[]) {
        let parts:string[] = [];
		let index = 0;
        desc.replace(/ +/gm, ' ').split('\n').map(line => line.split(' ')).map(line => {
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
        } else if ( parser === Parser.collect) {
            parts[0] = ` [Repeatable]${parts[0]}`;
        }
        if(parts.length>1)parts.push('');
        return parts;
    }
    static drawArg(arg: Argument):string {
		return {
			[OptionKind.required]: `<${chalk.green(arg.name)}>`,
			[OptionKind.optional]: `[${chalk.blueBright(arg.name)}]`,
		}[arg.kind];
    }
	static renderOptions(option:Option<any>, desc_limit: number, desc_len: (text?: string) => number, tags_len: (text?: string) => number, val_len: (text?: string) => number) {
		let parts = HelpRenderer.formatDescription(option.description, desc_limit, option.parser, option.validation);
		parts.map(p => desc_len(p));
		let {short, tag} = option;
		let arg_len = option.tag_desc.length;
		if (!short) {
			short = tag;
			tag = '';
		} else {
			tag = `, ${tag}`;
		}
		let len = short.length + tag.length;
		tags_len(short + tag);
		val_len(option.tag_desc);
		return [`${chalk.cyan(short)}${chalk.gray(tag)}`, parts, len, option.tag_desc, arg_len, option.defaults];
		
	}
}