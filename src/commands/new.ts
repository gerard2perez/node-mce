import { chmodSync, copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ask, error, ok } from "../console";
import { bool, enumeration, Parsed } from '../core/options';
import { remove } from "../remove";
import { spawn } from "../spawn";
import { spin } from "../spinner";
import { fFile, makeDir } from '../utils';
import { override } from "../override";
import { targetPath } from "../paths";

const templateDir = join(__dirname, '../templates').replace('src/', '').replace('src\\', '');
export const options = {
	force: bool('-f', 'Overrides target directory'),
	npm: bool('-n', 'Install npm dependencies'),
	style: enumeration('-s <style>', 'Define the style of command you will use. If you need more than one command use git.', ['git', 'single'],'single'),
};
let RelPathRoot;
function cfFile(...path:string[]) {
	path.splice(0,0,RelPathRoot);
	ok(fFile(...path));
}
function project (...path:string[]) {
	return join(RelPathRoot, ...path);
}
function copy (file:string, target?:string) {
	target =target || file;
	copyFileSync(join(templateDir, file), project(target));
	cfFile(...target.split('\\'));
}
// function nproy(...path:string[]) {
// 	return targetPath(RelPathRoot, ...path);
// }
export const description = 'Creates a new MCE project.'
export const args = '<application>';
export  async function action(application:string, opt:Parsed<typeof options>) {
	const nproy = targetPath.bind(null, application);
	RelPathRoot = application;
	if(!(await override('Directory already exist. Do you want to override it', application, opt.force)))
		return;
	await spin('Creating Files', async () => {
		makeDir(nproy());
		copy('app', application);
		chmodSync(nproy(), 744 );
		copy('tsconfig.json');
		makeDir(nproy('src'));
		let cli = `import { MCE } from "node-mce";`;
		if (opt.style === 'git') {
			cli += '\n\nMCE(__dirname).subcommand(process.argv);';
		} else {
			cli += '\n\nMCE(__dirname).command(process.argv);'
		}
		writeFileSync(project('src', 'cli.ts'), cli)
		cfFile('src', 'cli.ts');
		if(opt.style === 'git') {
			makeDir(nproy('src', 'commands'));
			copy(join('src', 'index.ts.tmp'), join('src', 'commands', 'removeme.ts'));
		} else {
			copy(join('src', 'index.ts.tmp'), join('src', 'index.ts'));
		}
		makeDir(nproy('.vscode'));
		copy(join('.vscode', 'launch.json'));
		copy(join('.vscode', 'settings.json'));
		copy(join('.vscode', 'tasks.json'));
		let _package = {
			name: application,
			version: '1.0.0',
			description: '',
			main: `./${application}`,
			bin: {
				[application]: `./${application}`
			},
			scripts: {
				test: "mocha test/**/*.test.ts"
			},
			repository: {},
			keywords:['mce', 'cmd'],
			author:'',
			license:'MIT',
			devDependencies: {
				"@types/node": "^10.3.2",
				"mocha": "^5.2.0",
				"ts-node": "^6.1.1",
				"typescript": "^2.9.1"
			},
			dependencies: {
				"chalk": "^2.4.1",
				"signal-exit": "^3.0.2"
			}
		};
		_package.dependencies["node-mce"] = "^1.0.0";
		writeFileSync(project("package.json"), JSON.stringify(_package, null,2));
	});
	// istanbul ignore next
	opt.npm && await spin('Initializing npm', async() => {
		if ( !await spawn('npm', ['install', '-S'], {cwd: project()}).catch(()=>false) ) {
			error('npm installation failed');
		}
		if ( process.env.MCE_DEV ) {
			await spawn('npm', ['link', 'node-mce'], {cwd: project()}).catch(()=>false)
		}
	});
	await spin('Initializing git', async()=>{
		// istanbul ignore next
		if ( !await spawn('git', ['init'], {cwd: project()}).catch(()=>false) ) {
			error('git init')
		}
	});
	copy('.gitignore');
}