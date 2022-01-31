import chalk from 'chalk'
import { Argument } from './argument'
import { Option, OptionKind, Parser } from './option'
function padding(text: string, len: () => number, long?: number) {
	if (long >= 0) {
		let after = ''
		while (long < len()) {
			long++
			after += ' '
		}
		text += after
	} else {
		while (text.length < len()) text += ' '
	}
	return text
}
export class HelpRenderer {
	static formatOption(option: any, tags_len, val_len, desc_len) {
		const [tags, desc, tagLen, val, valLen, defaults] = option
		const def = defaults && (defaults.length || defaults > 0) ? `[${chalk.red(defaults)}]` : ''
		const [main, ...overflow] = desc
		const argDescription = [`${padding(tags, tags_len, tagLen)} ${padding(val, val_len, valLen)} ${chalk.white(padding(main, desc_len).trimRight())} ${def}`]
		overflow.map(d => argDescription.push(`${padding('', tags_len)}  ${padding('', val_len)} ${chalk.white(d)}`))
		return argDescription.map(arg => `\n        ${arg}`).join('')
	}
	static formatDescription(desc: string, desc_limit: number, parser: Parser, expresion: string[]) {
		const parts: string[] = []
		let index = 0
		desc.replace(/ +/gm, ' ').split('\n').map(line => line.split(' ')).map(line => {
			for (const word of line) {
				parts[index] = parts[index] || ''
				parts[index] += ` ${word}`
				if (parts[index].length > desc_limit) {
					index++
				}
			}
			index++
		})
		if ((parser as any).isEnum === Parser.enum) {
			parts.push(` Values: ${expresion.join(' | ')}`)
		} else if (parser === Parser.collect) {
			parts[0] = ` [Repeatable]${parts[0]}`
		}
		if (parts.length > 1) parts.push('')
		return parts
	}
	static drawArg(arg: Argument): string {
		return {
			[OptionKind.required]: chalk`<{green ${arg.name}}>`,
			[OptionKind.optional]: chalk`[{blueBright ${arg.name}}]`,
			[OptionKind.varidac]: chalk`[{cyanBright ...${arg.name}}]`
		}[arg.kind]
	}
	static renderOptions(option: Option<any>, desc_limit: number, desc_len: (text?: string) => number, tags_len: (text?: string) => number, val_len: (text?: string) => number) {
		const parts = HelpRenderer.formatDescription(option.description, desc_limit, option.parser, option.validation)
		parts.map(p => desc_len(p))
		let { short, tag } = option
		const arg_len = option.tag_desc.length
		if (!short) {
			short = tag
			tag = ''
		} else {
			tag = `, ${tag}`
		}
		const len = short.length + tag.length
		tags_len(short + tag)
		val_len(option.tag_desc)
		return [`${chalk.cyan(short)}${chalk.gray(tag)}`, parts, len, option.tag_desc, arg_len, option.defaults]

	}
}