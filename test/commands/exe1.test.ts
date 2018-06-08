import {  Command, Parsed, numeric, floating, range, list, text, collect, verbose, bool } from "../../src/command";
import { wait, spin } from "../../src/spinner";

let _options = {
    integer: numeric('-i <n>', 'An integer argument', 5),
    float: floating('-f <n>', 'A float argument', 2.0),
    range: range('-r <a>..<b>', 'A range'),
    list: list('-l <items>', 'A list'),
    optional: text('-o [value]', 'An optional value'),
    collect: collect('-c [value]', 'A repeatable value'),
    collectName: text('--collect-name [value]', 'A repeatable value'),
	verbose: verbose(),
	size: text('-s <size>', 'Pizza Size', /^(large|medium|small)$/i, 'medium'),
	fixed: bool('-L', 'Make file Fixed'),
	fix: bool('-F', 'Make file Fixedssad')
};
class Exe1 extends Command {
	command = 'certbot'
	arguments = '<dir> [otherDirs...]'
    options = _options
    async action(file:string, others:string[], options:Parsed<typeof _options>) {
		let f = spin(`Doing something to ${file}`, async(info, warn) => {
			info('Vamos a esperar');
			await wait(1000);
			info('Un poco más');
			await wait(1000);
			warn('Es demasiado');
			await wait(1000);
			throw new Error('File not found');
		});
    }
}
new Exe1().call(process.argv);