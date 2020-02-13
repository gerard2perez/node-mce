import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '@gerard2p/mce';
import { created, updated, ok, error, warn, info, ask, input } from '@gerard2p/mce/verbose';
import {  makeDir, cp, printRelativePath, targetPath, cliPath } from '@gerard2p/mce/utils';
import { spin } from '@gerard2p/mce/spinner';
enum Styles { 
    git = 'git',
    single = 'single' 
}
export let description = 'A description for your command';
export let args = '<arg1> [varidac...]';
export let options = {
    enumeration: enumeration('-e <enum>', 'Define the style of command you will use', Styles,Styles.single),
    number: numeric('-n <n>', 'A number'),
    floating: floating('-f <n>', 'A float number'),
    range: range('-r <a>..<b>', 'A Range of two numbers'),
    text: text('-t <n>', 'A string value'),
    list: list('-l <n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    bool: bool('-b', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
};
export async function action(arg1:string, varidac:string[], opt:Parsed<typeof options>) {
    
}