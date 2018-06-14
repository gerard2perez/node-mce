import { Parsed, Command } from "node-mce/command";
declare let _options: {
    number: any;
    floating: any;
    range: any;
    text: any;
    list: any;
    collect: any;
    bool: any;
    verbose: any;
};
export default class RemoveMe extends Command {
    options: {
        number: any;
        floating: any;
        range: any;
        text: any;
        list: any;
        collect: any;
        bool: any;
        verbose: any;
    };
    description: string;
    arguments: string;
    action(arg1: string, varidac: string[], options: Parsed<typeof _options>): Promise<void>;
}
export {};
