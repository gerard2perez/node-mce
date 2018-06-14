import { Parsed, Command } from "../command";
declare let _options: {
    number: [string, string, Parser, RegExp, any, number];
    floating: [string, string, Parser, RegExp, any, number];
    range: [string, string, Parser, RegExp, any, [number, number]];
    text: [string, string, Parser, RegExp, any, string];
    list: [string, string, Parser, RegExp, any, string[]];
    collect: [string, string, Parser, RegExp, any, string[]];
    bool: [string, string, Parser, RegExp, any, boolean];
    verbose: [string, string, Parser, RegExp, any, number];
};
export default class Add extends Command {
    options: {
        number: [string, string, Parser, RegExp, any, number];
        floating: [string, string, Parser, RegExp, any, number];
        range: [string, string, Parser, RegExp, any, [number, number]];
        text: [string, string, Parser, RegExp, any, string];
        list: [string, string, Parser, RegExp, any, string[]];
        collect: [string, string, Parser, RegExp, any, string[]];
        bool: [string, string, Parser, RegExp, any, boolean];
        verbose: [string, string, Parser, RegExp, any, number];
    };
    description: string;
    arguments: string;
    action(arg1: string, varidac: string[], options: Parsed<typeof _options>): Promise<void>;
}
export {};
