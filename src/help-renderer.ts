import chalk from 'chalk';
import { Parser } from './options';
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
        let argDescription = [`${padding(tags, tags_len, tagLen)} ${padding(val, val_len, valLen)} ${chalk.white(padding(main, desc_len))} ${def}`];
        overflow.map(d=>argDescription.push(`${padding('', tags_len)}  ${padding('', val_len)} ${chalk.white(d)}`))
        return argDescription.map(arg=>`\n        ${arg}`).join('');
    }
    static formatDescription(desc: string, desc_limit: number, parser:Parser, expresion:string[]) {
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
        } else if ( parser === Parser.collect) {
            parts[0] = ` [Repeatable]${parts[0]}`;
        }
        if(parts.length>1)parts.push('');
        return parts;
    }
    static drawArg(arg: string) {
        return arg.replace(/<(.*)>/, `<${chalk.green("$1")}>`)
            .replace(/\[(.*)\]/, `[${chalk.blueBright("$1")}]`);
    }
    static formatTags(key: string, option: string, parser:Parser) {
        let [short, value=''] = option.split(' ');
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
        value = HelpRenderer.getDefaultValueFor(parser, value);
        return { tag, short, value, stagdesc };
    }
    static getDefaultValueFor(parser:Parser, value:string) {
        if(!value) {
            switch(parser) {
                case Parser.list:
                    return `<a>,<b>..<n>`;
                case Parser.string:
                    return value = ' ';
                case Parser.range:
                    return value = '<a>..<b>';
                case Parser.collect:
                    return value = '<c>';
                case Parser.int:
                case Parser.float:
                    return value = '<n>';
                case Parser.enum:
                    return value = '<e>';
            }
        }
        return value;
    }
}