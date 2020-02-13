import { bool, enumeration, Parsed } from '../';
import { error } from "../console";
import { override } from "../override";
import { targetPath } from "../paths";
import { spawn } from "../spawn";
import { spin } from "../spinner";
import { c, chain_return, d, r, w, z, match, intercept } from "../tree-maker";
import {posix, join} from 'path';

enum Styles {
	git = 'git',
	single= 'single'
}
export const options = {
	force: bool('-f', 'Overrides target directory'),
	npm: bool('-n', 'Install npm dependencies'),
	style: enumeration('-s <style>', 'Define the style of command you will use. If you need more than one command use git.', Styles, Styles.single),
};
let nproy;
export const description = 'Creates a new MCE project.'
export const args = '<application>';
export  async function action(application:string, opt:Parsed<typeof options>) {

	nproy = targetPath.bind(null, application);
	if(!(await override('Directory already exist. Do you want to override it', nproy(), opt.force)))
		return;
	let tree = await createProjectExtructure(application, opt.style);
	// istanbul ignore next
	opt.npm && await spin('Initializing npm', async() => {
		if ( !await spawn('npm', ['install', '-S'], {cwd: nproy()}).catch(()=>false) ) {
			error('npm installation failed');
		}
	});
	await spin('Initializing git', async()=>{
		// istanbul ignore next
		if ( !await spawn('git', ['init'], {cwd: nproy()}).catch(()=>false) ) {
			error('git init')
		}
		tree.w(c('gitignore','.gitignore'))
	});
}
async function createProjectExtructure(application: string, style:Styles) {
	let tree:chain_return;
	await spin('Creating Files', async () => {
		let cli = `import { MCE } from "@gerard2p/mce";\n\nMCE(__dirname).${style === Styles.git ? 'subcommand':'command'}(process.argv);`;
		intercept((folder:string)=>join(__dirname, '../templates', folder));
		tree = r(application);
		tree.w(
			c('app', application),
			c('tsconfig.json')
		)
		.d('src',
			w('cli.ts', cli),
			match(style == Styles.single, c('index.ts')),
			match(style == Styles.git, d('commands', c('../index.ts', 'removeme.ts'))),
		)
		.d('.vscode',
			c('launch.json'),
			c('settings.json'),
			c('tasks.json')
		)
		.w(z('package.json',{application}));
	});
	return tree;
}
