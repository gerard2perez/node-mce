import { writeFileSync } from "../fs";
import { join } from "path";
import { error, ok } from "../console";
import { bool, enumeration, Parsed } from '../';
import { spawn } from "../spawn";
import { spin } from "../spinner";
import { printRelativePath, makeDir, cp } from '../utils';
import { override } from "../override";
import { targetPath, cliPath } from "../paths";
import { render } from "../render";

function templates (...path:string[]) {
	return cliPath('templates', ...path).replace('src/templates/', 'templates/').replace('src\\templates\\', 'templates\\');
}
const copy = (file:string, target:string = file) => cp(templates(file), nproy(target));
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
	await createProjectExtructure(application, opt.style);
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
		copy('gitignore','.gitignore');
	});
}
async function createProjectExtructure(application: string, style:Styles) {
	await spin('Creating Files', async () => {
		makeDir(nproy());
		copy('app', application);
		copy('tsconfig.json');
		makeDir(nproy('src'));
		let cli = `import { MCE } from "@gerard2p/mce";\n\nMCE(__dirname).${style === Styles.git ? 'subcommand':'command'}(process.argv);`;
		writeFileSync(nproy('src', 'cli.ts'), cli);
		printRelativePath(nproy('src', 'cli.ts'));
		if (style === Styles.git) {
			makeDir(nproy('src', 'commands'));
			copy(join('src', 'index.ts'), join('src', 'commands', 'removeme.ts'));
		}
		else {
			copy(join('src', 'index.ts'), join('src', 'index.ts'));
		}
		makeDir(nproy('.vscode'));
		copy(join('.vscode', 'launch.json'));
		copy(join('.vscode', 'settings.json'));
		copy(join('.vscode', 'tasks.json'));
		render(templates('package.json'), {application}, nproy('package.json'));
		ok(printRelativePath(nproy('package.json')));
	});
}
