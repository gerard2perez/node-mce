import { Parsed, Command } from "../command";
declare let _options: {
    force: [string, string, Parser, RegExp, any, boolean];
    npm: [string, string, Parser, RegExp, any, boolean];
    style: [string, string, Parser, RegExp, any, string];
};
export default class New extends Command {
    description: string;
    arguments: string;
    options: {
        force: [string, string, Parser, RegExp, any, boolean];
        npm: [string, string, Parser, RegExp, any, boolean];
        style: [string, string, Parser, RegExp, any, string];
    };
    action(application: string, options: Parsed<typeof _options>): Promise<void>;
}
export {};
