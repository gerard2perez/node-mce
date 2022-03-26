import { join } from 'path'
import { error } from '../output'
import { existsSync } from '../mockable/fs'
import { callerPath, copy, pathResolver } from '../fs'
export const description = 'Adds a new command to the git project.'
export const args = '<command>'
export  async function action(command: string/*, opt:Parsed<typeof options>*/) {
	pathResolver((folder: string) => join(__dirname, '../templates', folder), p => p)
	if(existsSync(callerPath('src/commands')))	 {
		copy(join('src', 'index.ts'), join('src', 'commands', `${command}.ts`))
	} else {
		error`this project does not have a commands folder`
	}
}
