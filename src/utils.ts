import chalk from "chalk";
import { ok } from "./console";
import { targetPath } from "./paths";
import { join } from "path";
import { mkdirSync } from "fs";
export function fFile(...path:string[]) {
	let last:string = path.pop();
	if(path.length === 0) {
		return `${chalk.green(last)}`;
	} else {
		let route = chalk.grey(join(...path).replace(/\\/mg, '/'));
		return `${route}/${chalk.green(last)}`;
	}
    
}
function print (mode:String, text:string) {
    let fpath = text.replace(targetPath(), '').replace(/\\/gm, '/').split('/');
    ok(`\t${chalk.cyan('created')}: ${fFile(...fpath)}`);
}
export const created = print.bind(null, 'created');
export const updated = print.bind(null, 'updated');
export function iter(obj: any) {
    Object.defineProperty(obj, Symbol.iterator, {
        configurable: true,
        value: function () {
            let keys = Object.keys(this);
            let data: any = this;
            let total = keys.length;
            return {
                i: 0,
                next() {
                    let current = this.i;
                    let key = keys[current];
                    return {
                        value: [
                            key,
                            data[key],
                            current,
                            total
                        ],
                        done: this.i++ === total
                    };
                }
            };
        }
    });
    return obj;
}
export function makeDir(location:string) {
	let tocreate = location;
	let diff = location.replace(targetPath(), '')
				.replace(/^\\/, '').replace(/\\/mg, '/').split('/');
	mkdirSync(tocreate);
	ok(fFile(...diff));
}