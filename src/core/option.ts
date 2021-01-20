import { MCEProgram } from '../mce-cli'
import { Command } from './command'
export type Range = [start:number, end:number]
export type List = string[]
export enum Parser {
    float = <any>((n: string, d: number) => parseFloat(n) || d),
    int = <any>((n: string, d: number) => parseInt(n) || d),
    range = <any>(str => str.split('..').map(n => parseInt(n, 10)).splice(0)),
    list = <any>(s => s.split(',')),
    collect = <any>((val, memo) => { memo.push(val);return memo.splice(0) }),
    increaseVerbosity = <any>((_, t) => t+1),
    string = <any>(s => s===true?'':s.toString()),
    truefalse = <any> (s => s),
    enum = <any>(s => s.toString()),
}
export enum OptionKind {
    no,
    required,
    optional,
    boolean,
    varidac,
    verbose
}
export class Option<T> {
	name: string
	tag: string
	short: string
	tag_desc: string
	kind: OptionKind
	constructor(
		private option: string,
		public description: string,
		public parser: Parser,
		public validation: string[],
		public defaults: T
	) { }
	makeTag(name: string, command: Command|MCEProgram) {
		let [short, value=''] = this.option.split(' ')
        if (!short.includes('-')) {
            value = short
            short = undefined
        }
        if (short && short.includes('--')) short = undefined
        let tag = `--${name}`
        if (name.length === 1) {
            tag = `-${name}`
        }
		this.tag = tag.replace(/([A-Z])/gm, '-$1').toLowerCase()
		if(short && command.unic_shorts.includes(short)) {
			throw new Error(`[${command.name} duplicated short tag ${short}. This is a problem related to the program.`)
		} else if(short) {
			command.unic_shorts.push(short)
		}
		this.short = short
		this.tag_desc = Option.getDefaultValueFor(this.parser, value)
		this.kind = this.getKind(this.tag_desc, this.parser)
		this.name = name
		return this
	}
	private getKind(value: string, parser: Parser): OptionKind{
		return !value ? Parser.truefalse === parser ? OptionKind.boolean : Parser.increaseVerbosity === parser ? OptionKind.verbose :/* istanbul ignore next */ OptionKind.no : value.includes('<') ? OptionKind.required : OptionKind.optional
	}
	static getDefaultValueFor(parser: Parser, value: string) {
        if(!value) {
            switch(parser) {
				case Parser.list: 
					value = '<a>,<b>..<n>'
					break
				case Parser.string:
					value = ' '
					break
				case Parser.range:
					value = '<a>..<b>'
					break
				case Parser.collect:
					value = '<c>'
					break
                case Parser.int:
                case Parser.float:
					value = '<n>'
					break
                case Parser.enum:
					value = '<e>'
					break
            }
        }
        return value
	}
	private has(args: string[]) {
		const [index=-1] = ([
			args.includes(this.tag) && args.indexOf(this.tag),
			this.short && args.includes(this.short) && args.indexOf(this.short)
		] as (boolean|number)[]).filter(p => p!==false).sort()
		return index as number
	}
	find(args: string[]) {
		let value = this.defaults
		for(let i=this.has(args); i>=0; i=this.has(args)) {
			const start = args.splice(0, i)
			const [TAG] = args.splice(0, 1)
			const [VAL] = args
			const parser = this.parser as any
			if (!this.validateValue(this.validation, VAL))
            throw new Error(`Argument '${TAG} ${VAL}' does not match expression '${this.validation}'`)
			value = this.extractValue(VAL, args, i, value, parser, TAG)
			args.splice(0, 0, ...start)
		}
		return value
	}
	private extractValue(VAL: string, args: string[], i: number, value: T, parser: (...args: any[]) => any, TAG: string) {
		switch (this.kind) {
			case OptionKind.required:
				if (!VAL || VAL.includes('-'))throw new Error(`Missing value for argument ${args[i - 1]}`)
				value = parser(VAL, value)
				args.splice(0, 1)
				break
			case OptionKind.optional:
				if (VAL && !VAL.includes('-')) {
					value = parser(VAL, value)
					args.splice(0, 1)
				} else {
					value = parser(true, value)
				}
				break
			case OptionKind.boolean:
				value = parser(true)
				break
			case OptionKind.verbose:
				value = parser(TAG, value)
				break
		}
		return value
	}
	private validateValue(expression: RegExp | Array<string>, val: string) {
        let matched = true
        if (expression instanceof RegExp) {
            matched = expression.exec(val) != null
        } else if (expression instanceof Array) {
            matched = expression.includes(val)
        }
        return matched
    }
}