import { numeric, floating, range, text, list, collect, bool, verbose, Parsed} from '../options';
import { Command } from "../command";
import { ok, error, warn, info, ask, input } from '../console';
import { spin } from '../spinner';

let _options = {
    number: numeric('-n <n>', 'A number'),
    floating: floating('-f <n>', 'A float number'),
    range: range('-r <a>..<b>', 'A Range of two numbers'),
    text: text('-t <n>', 'A string value'),
    list: list('<n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    bool: bool('-b', 'A boolean value'),
    verbose: verbose(),
}
export default class Add extends Command {
    options = _options
    description = 'A description for your command'
    arguments = '<arg1> [varidac...]'
    async action(arg1:string, varidac:string[], options:Parsed<typeof _options>) {

    }
}