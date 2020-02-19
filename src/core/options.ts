import { Option, Parser, Range, List } from "./option";
interface DataGroup { 
    [p:string]: Option<number> | Option<Range> | Option<boolean> | Option<string> | Option<Range> | Option<List>;
}
export type Parsed<T extends DataGroup > = { 
	readonly [P in keyof T]: T[P]['value'];
}
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
	return new Option<T>(option, description, parser, exp, defaults);
}
export function enumeration<T extends string[]>(option:string, description:string, options:T, defaults?:T[number]) : Option<T[number]>;
export function enumeration<T>(option:string, description:string, options:any, defaults?:T) : Option<T>;
export function enumeration(option:string, description:string, options:any, defaults?:any) {
	if(!(options instanceof Array)) {
		options = Object.keys(options).map(k=>options[k]) as any;
	}
    return preOptions(Parser.enum, option, description, options, defaults);
}
export function numeric(option:string, description:string, exp:RegExp, defaults?:number) : Option<number>;
export function numeric(option:string, description:string, defaults?:number) : Option<number>;
export function numeric(...args) {
	//@ts-ignore
	return preOptions<string>(Parser.int, ...args);
}
export function floating(option:string, description:string, exp:RegExp, defaults?:number) : Option<number>;
export function floating(option:string, description:string, defaults?:number) : Option<number>;
export function floating(...args) {
	//@ts-ignore
	return preOptions<string>(Parser.float, ...args);
}
export function range(option:string, description:string, exp:RegExp, defaults?:Range) : Option<Range>;
export function range(option:string, description:string, defaults?:Range) : Option<Range>;
export function range(...args) {
	//@ts-ignore
	return preOptions<string>(Parser.range, ...args);
}
export function text(option:string, description:string, exp:RegExp, defaults?:string) : Option<string>;
export function text(option:string, description:string, defaults?:string) : Option<string>;
export function text(...args) {
	//@ts-ignore
	return preOptions<string>(Parser.string, ...args);
}
export function list(option:string, description:string, exp:RegExp, defaults?:List) : Option<List>;
export function list(option:string, description:string, defaults?:List) : Option<List>;
export function list(...args) {
	//@ts-ignore
	return preOptions<List>(Parser.list, ...args);
};
export function collect(option:string, description:string, exp:RegExp, defaults?:List) : Option<List>;
export function collect(option:string, description:string, defaults?:List) : Option<List>;
export function collect(...args) {
	//@ts-ignore
	return preOptions<List>(Parser.collect, ...args);
};

export function bool(short:string, description:string) : Option<boolean> {
	return preOptions(Parser.truefalse, short, description);
}

export function verbose(desciprtion?:string): Option<number> {
	return preOptions(Parser.increaseVerbosity, '-v', desciprtion);
}