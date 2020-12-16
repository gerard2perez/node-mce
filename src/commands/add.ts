import { join } from "path";
import { existsSync } from "../fs";
import { callerPath, copy, pathResolver } from "../tree-maker/fs";
import { error } from "../verbose";
export const description = 'Adds a new command to the git project.'
export const args = '<command>';
export  async function action(command:string/*, opt:Parsed<typeof options>*/) {
	pathResolver((folder:string) => join(__dirname, '../templates', folder), p=>p);
	if(existsSync(callerPath('src/commands')))	 {
		copy(join('src', 'index.ts'), join('src', 'commands', `${command}.ts`));
	} else {
		error('this project does not have a commands forlder');
	}
}