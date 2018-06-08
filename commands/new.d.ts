import { Parsed, Command } from "../command";
declare let _options: {
    integer: [string, string, Parser, RegExp, any, number];
    float: [string, string, Parser, RegExp, any, number];
    range: [string, string, Parser, RegExp, any, [number, number]];
    list: [string, string, Parser, RegExp, any, string[]];
    optional: [string, string, Parser, RegExp, any, string];
    collect: [string, string, Parser, RegExp, any, string[]];
    collectName: [string, string, Parser, RegExp, any, string];
    verbose: [string, string, Parser, RegExp, any, number];
    size: [string, string, Parser, RegExp, any, string];
    fixed: [string, string, Parser, RegExp, any, boolean];
    fix: [string, string, Parser, RegExp, any, boolean];
};
export default class New extends Command {
    description: string;
    arguments: string;
    options: {
        integer: [string, string, Parser, RegExp, any, number];
        float: [string, string, Parser, RegExp, any, number];
        range: [string, string, Parser, RegExp, any, [number, number]];
        list: [string, string, Parser, RegExp, any, string[]];
        optional: [string, string, Parser, RegExp, any, string];
        collect: [string, string, Parser, RegExp, any, string[]];
        collectName: [string, string, Parser, RegExp, any, string];
        verbose: [string, string, Parser, RegExp, any, number];
        size: [string, string, Parser, RegExp, any, string];
        fixed: [string, string, Parser, RegExp, any, boolean];
        fix: [string, string, Parser, RegExp, any, boolean];
    };
    action(file: string, options: Parsed<typeof _options>): Promise<void>;
}
export {};
