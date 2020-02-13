import { existsSync } from "../fs";
import { join } from "path";
import { error } from "../verbose";
import { cliPath, targetPath } from "../paths";
import { copy, intercept } from "../tree-maker";
export const description = 'Adds a new command to the git project.'
export const args = '<command>';
export  async function action(command:string/*, opt:Parsed<typeof options>*/) {
	intercept((folder:string)=>join(__dirname, '../templates', folder), p=>p);
	if(existsSync(targetPath('src/commands')))	 {
		copy(join('src', 'index.ts'), join('src', 'commands', `${command}.ts`));
	} else {
		error('this project does not have a commands forlder');
	}
}