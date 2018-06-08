declare global {
    interface Object {
        [Symbol.iterator]: () => Iterator<[string, any, number, number]>;
    }
}
export declare enum Parser {
    float,
    int,
    range,
    list,
    collect,
    increaseVerbosity,
    string,
    truefalse
}
export declare type range = [number, number];
export declare type list = string[];
export interface DataGroup2 {
    [p: string]: tOptions<number> | tOptions<range> | tOptions<boolean> | tOptions<string> | tOptions<range> | tOptions<list>;
}
export declare type Parsed<T extends DataGroup2> = {
    readonly [P in keyof T]: T[P][5];
};
export declare type tOptions<T> = [string, string, Parser, RegExp, any, T];
interface OptionBuilder<T> {
    (option: string, description: string, exp: RegExp, defaults?: any): tOptions<T>;
    (option: string, description: string, defaults?: any): tOptions<T>;
}
export declare const numeric: OptionBuilder<number>;
export declare const floating: OptionBuilder<number>;
export declare const range: OptionBuilder<range>;
export declare const text: OptionBuilder<string>;
export declare const list: OptionBuilder<list>;
export declare const collect: OptionBuilder<list>;
export declare const bool: OptionBuilder<boolean>;
export declare const verbose: (desciprtion?: string) => tOptions<number>;
declare enum OptionKind {
    no = 0,
    required = 1,
    optional = 2,
    boolean = 3,
    varidac = 4
}
interface ParserCommands {
    rawvalue: string;
    tags: string[];
    defaults: any;
    expression: RegExp;
    parser: Function;
    value: OptionKind;
}
declare class Command {
    private command;
    constructor(command: string);
    description: string;
    options: {
        [p: string]: tOptions<any>;
    };
    mappedTags: {
        [p: string]: ParserCommands;
    };
    shortTags: {
        [p: string]: ParserCommands;
    };
    arguments: string;
    call(argv: string[]): void;
    drawArg(arg: string): string;
    help(): void;
    execute(args: string[]): void;
    private argInfo;
    private extractValue;
    private repetableShort;
    private getTags;
    action(...data: any[]): void;
}
export { Command, Command as default };
