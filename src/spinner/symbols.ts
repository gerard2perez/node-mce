import chalk from 'chalk';

export let supported =  !process.env.TEST && (process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color' || process.env.VSCODE_PID);
export enum LogSymbols {
	/** 'ℹ' : 'i' */
	info = <any>chalk.blue(supported ? 'ℹ' : 'i'),
	/** '✔' : '√' */
	success = <any>chalk.green(supported ? '✔' : '√'),
	/** '⚠' : '!!' */
	warning = <any>chalk.yellow(supported ? '⚠' : '!!'),
	/** '✖' : '×' */
	error = <any>chalk.red(supported ? '✖' : '×'),
}