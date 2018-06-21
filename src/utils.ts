import chalk from "chalk";
import { ok } from "./console";
import { targetPath } from "./paths";
import { join } from "path";

export function capitalize(text:string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function fFile(...path:string[]) {
	// path.splice(0,0,targetPath());
    let last:string = path.pop();
    let route = chalk.grey(join(...path).replace(/\\/mg, '/'));
	return `${route}/${chalk.green(last)}`; // (join(...path, chalk.green(last)));
}
export function created (text:string) {
    let fpath = text.replace(targetPath(), '').replace(/\\/gm, '/').split('/');
    ok(`\t${chalk.cyan('created')}: ${fFile(...fpath)}`);
}

export function updated (text:string) {
    let fpath = text.replace(targetPath(), '').replace(/\\/gm, '/').split('/');
    ok(`\t${chalk.cyan('updated')}: ${fFile(...fpath)}`);
}