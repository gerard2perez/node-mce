function _range (str) { 
    return str.split('..').map(n => parseInt(n, 10)).splice(0);
 }
function _list (str) { return str.split(','); }
function _collect(val, memo) {
    memo.push(val);
    return memo.splice(0);
}
function _increaseVerbosity(v, total) {
    return total + 1;
}
export enum Parser {
    float = <any>((n:string, d:number) => parseFloat(n) || d),
    int = <any>((n:string, d:number) => parseInt(n) || d),
    range = <any>_range,
    list = <any>_list,
    collect = <any>_collect,
    increaseVerbosity = <any>_increaseVerbosity,
    string = <any>(s => s.toString()),
    truefalse = <any> (s=>s),
    enum = <any>(s => s.toString()),
}
export type range = [number, number];
export type list = string[];
export interface DataGroup { 
    [p:string]: MCEOption<number> | MCEOption<range> | MCEOption<boolean> | MCEOption<string> | MCEOption<range> | MCEOption<list>;
}
export type Parsed<T extends DataGroup > = { 
	readonly [P in keyof T]: T[P]['value'];
 }
export type tOptions<T> = [string, string, Parser, RegExp, any, T];
function preOptions<T>(parser:Parser, option:string, description:string, exp:RegExp | any =undefined, defaults:any=undefined) {
    if( arguments.length === 4 && !(exp instanceof RegExp)) {
        defaults = exp;
        exp = undefined;
    }
    switch(parser) {
		case Parser.truefalse:
			defaults = false;
			break;
        case Parser.increaseVerbosity:
            defaults = 0;
            break;
        case Parser.collect:
        case Parser.list:
        case Parser.range:
            defaults = defaults || [];
            break;
	}
	return new MCEOption<T>(option, description, parser, exp, defaults);
}
interface OptionBuilder<T> {
    (option:string, description:string, defaults?:T) : MCEOption<T>;
    (option:string, description:string, exp:RegExp, defaults?:T) : MCEOption<T>;
}
function enumeration<T extends string[]>(option:string, description:string, options:T, defaults?:T[number]) : MCEOption<T[number]>;
function enumeration<T>(option:string, description:string, options:any, defaults?:T) : MCEOption<T>;
function enumeration(option:string, description:string, options:any, defaults?:any) {
	if(!(options instanceof Array)) {
		options = Object.keys(options).map(k=>options[k]) as any;
	}
    return preOptions(Parser.enum, option, description, options, defaults);
}
export { enumeration };
export const numeric: OptionBuilder<number> = preOptions.bind(null, Parser.int)
export const floating: OptionBuilder<number> = preOptions.bind(null, Parser.float)
export const range: OptionBuilder<range> = preOptions.bind(null, Parser.range)
export const text: OptionBuilder<string> = preOptions.bind(null, Parser.string)
export const list: OptionBuilder<list> = preOptions.bind(null, Parser.list)
export const collect: OptionBuilder<list> = preOptions.bind(null, Parser.collect)
export const bool: (short:string, description:string) => MCEOption<boolean> = preOptions.bind(null, Parser.truefalse)
export const verbose: (desciprtion?:string)=>MCEOption<number> = preOptions.bind(null, Parser.increaseVerbosity, '-v')

export enum OptionKind {
    no,
    required,
    optional,
    boolean,
    varidac,
    verbose
}
export class MCEOption<T=any> {
	name:string
	value:T
	tag:string
	short:string
	tag_desc:string
	kind:OptionKind
	constructor(
		private option:string,
		public description:string,
		public parser:Parser,
		public validation: string[],
		public defaults:T
	) { }
	makeTag(name:string, command:any) {
		let [short, value=''] = this.option.split(' ');
        if (!short.includes('-')) {
            value = short;
            short = undefined;
        }
        if (short && short.includes('--')) short = undefined;
        let tag = `--${name}`;
        if (name.length === 1) {
            tag = `-${name}`;
        }
		this.tag = tag.replace(/([A-Z])/gm, "-$1").toLowerCase();
		if(short && command.unic_shorts.includes(short)) {
			throw new Error(`[${command.name} duplicated short tag ${short}. This is a problem related to the program.`);
		} else if(short) {
			command.unic_shorts.push(short);
		}
		this.short = short;
		this.tag_desc = MCEOption.getDefaultValueFor(this.parser, value);
		this.kind = this.getKind(this.tag_desc, this.parser);
		this.name = name;
		return this;
	}
	private getKind(value:string, parser:Parser): OptionKind{
		return !value ? (Parser.truefalse === parser ? OptionKind.boolean : (Parser.increaseVerbosity === parser ? OptionKind.verbose :/* istanbul ignore next */ OptionKind.no)) : (value.includes("<") ? OptionKind.required : OptionKind.optional)
	}
	static getDefaultValueFor(parser:Parser, value:string) {
        if(!value) {
            switch(parser) {
				case Parser.list: 
					value = `<a>,<b>..<n>`;
					break;
				case Parser.string:
					value = ' ';
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
        return value;
	}
	has(args:string[]) {
		let [index=-1] = ([
			args.includes(this.tag) && args.indexOf(this.tag),
			this.short && args.includes(this.short) && args.indexOf(this.short)
		] as (boolean|number)[]).filter(p=>p!==false).sort();
		return index as number;
	}
	find(args:string[]) {
		let value = this.defaults;
		for(let i=this.has(args); i>=0; i=this.has(args)) {
			let start = args.splice(0, i);
			let [TAG] = args.splice(0,1);
			let [VAL] = args;
			//@ts-ignore
			let parser = this.parser as Function;
			if (!this.validateValue(this.validation, VAL))
            throw new Error(`Argument '${TAG} ${VAL}' does not match expression '${this.validation}'`);
			value = this.extractValue(VAL, args, i, value, parser, TAG);
			args.splice(0,0,...start);
		}
		return value;
	}
	private extractValue(VAL: string, args: string[], i: number, value: T, parser: Function, TAG: string) {
		switch (this.kind) {
			case OptionKind.required:
				if (!VAL || VAL.includes('-'))throw new Error(`Missing value for argument ${args[i - 1]}`);
				value = parser(VAL, value);
				args.splice(0, 1);
				break;
			case OptionKind.optional:
				if (VAL && !VAL.includes('-')) {
					value = parser(VAL, value);
					args.splice(0, 1);
				} else {
					value = parser(true, value);
				}
				break;
			case OptionKind.boolean:
				value = parser(true);
				break;
			case OptionKind.verbose:
				value = parser(TAG, value);
				break;
		}
		return value;
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
}