import { existsSync } from "fs";
import { join } from "path";
import { error } from "../console";
import { cliPath, targetPath } from "../paths";
import { cp } from '../utils';

function templates (...path:string[]) {
	return cliPath('templates', ...path).replace('src/templates/', 'templates/').replace('src\\templates\\', 'templates\\');
}
let nproy;
const copy = (file:string, target:string = file) => cp(templates(file), nproy(target));
export const description = 'Adds a new command to the git project.'
export const args = '<command>';
export  async function action(command:string/*, opt:Parsed<typeof options>*/) {
	nproy = targetPath.bind(null);
	if(existsSync(targetPath('src/commands')))	 {
		copy(join('src', 'index.ts.tmp'), join('src', 'commands', `${command}.ts`));
	} else {
		error('this project does not have a commands forlder');
	}
}