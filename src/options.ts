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