let utf8 = /UTF-?8$/i.test(process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG);
let fixtures = process.env.CI || process.env.TERM === 'xterm-256color' || process.env.TERM === 'cygwin';
export let supported =  !process.env.TEST && (utf8 || fixtures);
export enum LogSymbols {
	/** 'ℹ' : 'i' */
	info = <any>(supported ? 'ℹ' : 'i'),
	/** '✔' : '√' */
	success = <any>(supported ? '✔' : '√'),
	/** '⚠' : '!!' */
	warning = <any>(supported ? '⚠' : '!!'),
	/** '✖' : '×' */
	error = <any>(supported ? '✖' : '×'),
	updated = <any>(supported ? '✐' : '√')
}