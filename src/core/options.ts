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
    [p:string]: tOptions<number> | tOptions<range> | tOptions<boolean> | tOptions<string> | tOptions<range> | tOptions<list>;
}
export type Parsed<T extends DataGroup > = { readonly [P in keyof T]: T[P][5]; }
export type tOptions<T> = [string, string, Parser, RegExp, any, T];
function preOptions<T>(parser:Parser, option:string, description:string, exp:RegExp | any =undefined, defaults:any=undefined) {
    if( arguments.length === 4 && !(exp instanceof RegExp)) {
        defaults = exp;
        exp = undefined;
    }
    switch(parser) {
        // case Parser.string:
        //     defaults = defaults || '';
        //     break;
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
    (option:string, description:string, defaults?:T) : tOptions<T>;
    (option:string, description:string, exp:RegExp, defaults?:T) : tOptions<T>;
}
function enumeration<T extends string[]>(option:string, description:string, options:T, defaults?:T[number]) : tOptions<T[number]>;
function enumeration<L>(option:string, description:string, options:any, defaults?:L) : tOptions<L>;
function enumeration(option:string, description:string, options:any, defaults?:any) {
	if(!(options instanceof Array)) {
		options = Object.keys(options).map(k=>options[k]) as any;
	}
    return preOptions(Parser.enum, option, description, options, defaults);
}
export { enumeration };
// export const enumeration2: OptionBuilder<string> = preOptions.bind(null, Parser.enum)
export const numeric: OptionBuilder<number> = preOptions.bind(null, Parser.int)
export const floating: OptionBuilder<number> = preOptions.bind(null, Parser.float)
export const range: OptionBuilder<range> = preOptions.bind(null, Parser.range)
export const text: OptionBuilder<string> = preOptions.bind(null, Parser.string)
export const list: OptionBuilder<list> = preOptions.bind(null, Parser.list)
export const collect: OptionBuilder<list> = preOptions.bind(null, Parser.collect)
export const bool: (short:string, description:string) => tOptions<boolean> = preOptions.bind(null, Parser.truefalse)
export const verbose: (desciprtion?:string)=>tOptions<number> = preOptions.bind(null, Parser.increaseVerbosity, '-v')

export enum OptionKind {
    no,
    required,
    optional,
    boolean,
    varidac,
    verbose
}