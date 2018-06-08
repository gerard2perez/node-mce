import { numeric, floating, range, list, text, collect, verbose, bool, Parsed, Command } from "../command";
import { spin, wait } from "../spinner";
import { ask } from "../input";

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
export default class New extends Command {
	description = 'Creates a new MCE project.'
    arguments = '<name>'
    options = _options
    async action(file:string, options:Parsed<typeof _options>) {
		await spin(`Doing something to ${file}`, async (info, warn, error, ok) => {
			await wait(1000);
			if( await ask('Ready to wait')) {
				ok('Vamos a esperar');
			} else {
				error('Lo haremos de cualquier modo');
			}
			await wait(1000);
			info('Un poco más');
			await wait(1000);
			warn('Es demasiado');
			await wait(1000);
			// throw new Error('File not found');
		});
		await ask('keep');
		await spin('Re Do', async (i,w) => {
			await wait(1000);
			// return 0;
		});
    }
}