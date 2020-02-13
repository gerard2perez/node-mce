import { bool, enumeration, Parsed } from '../';
import { override } from "../input";
import { spawn } from "../spawn";
import { spin } from "../spinner";
import { c, d, match, r, TreeMaker, w, z } from "../tree-maker";
import { error } from "../verbose";
import { project, template, callerPath, cliPath } from '../tree-maker/fs';

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

	nproy = callerPath.bind(null, application);
	//istanbul ignore if
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
	let tree:TreeMaker;
	await spin('Creating Files', async () => {
		let cli = `import { MCE } from "@gerard2p/mce";\n\nMCE(__dirname).${style === Styles.git ? 'subcommand':'command'}(process.argv);`;
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
		.w(
			z('package.json',{application}),
			c('incremental.js'),
			c('jest.config.js')
		);
	});
	return tree;
}
