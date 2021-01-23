import { bool, enumeration, PackageJSON, Parsed, text } from '..'
import { error } from '../console'
import { override } from '../input'
import { information } from '../program'
import { exec, LiveStream } from '../spawn'
import { spin } from '../spinner'
import { updateTextSpin } from '../spinner/console'
import { c, d, match, PackageJSON2Chain, r, TreeMaker, w, z } from '../tree-maker'
import { callerPath, cliPath } from '../tree-maker/fs'
function thenOrCatch<T>(result: LiveStream, retVal: T) {
	return result.data(chunck => {
		updateTextSpin(chunck.toString())
	})
	.error()
	.run()
	.then(result => result.toString(), _ => retVal)
}
enum Styles {
	git = 'git',
	single= 'single'
}
export const alias = 'n'
export const options = {
	author: text('-a', 'Author of the package', 'GIT_OR_NPM_USER'),
	force: bool('-f', 'Overrides target directory'),
	npm: bool('-n', 'Install npm dependencies'),
	style: enumeration('-s <style>', 'Define the style of command you will use. If you need more than one command use git.', Styles, Styles.single),
}
let nproy
export const description = 'Creates a new MCE project.'
export const args = '<application>'
export  async function action(application: string, opt: Parsed<typeof options>) {
	nproy = callerPath.bind(null, application)
	//istanbul ignore if
	if(!await override('Directory already exist. Do you want to override it', nproy(), opt.force))
		return
	const tree = await createProjectExtructure(application, opt)
	// istanbul ignore next
	opt.npm && await spin('Initializing npm', async() => {
		if ( await exec('npm', ['install', '-S'], {cwd: nproy()}).run().catch(() => false) === false ) {
			error`npm installation failed`
		}
	})
	await spin('Initializing git', async() => {
		const initResult = await thenOrCatch(exec('git', ['init'], {cwd: nproy()}), false)
		if ( initResult === false ) {
			error`git init`
		}
		tree.w(c('gitignore', '.gitignore'))
	})
}
async function createProjectExtructure(application: string, opt: Parsed<typeof options>) {
	let tree: TreeMaker
	let {author} = opt
	/* istanbul ignore else */
	if(author === 'GIT_OR_NPM_USER') {
		let git_user: any = await thenOrCatch(exec('git', ['config', 'user.name'], {}), '')
		const git_email: any = await thenOrCatch(exec('git', ['config', 'user.email'], {}), '')
		/* istanbul ignore else */
		if(!git_user) git_user = await thenOrCatch(exec('npm', ['whoami'], {}), '')
		author = `${git_user.trim()} <${git_email.trim()}>`
	}
	await spin('Creating Files', async () => {
		const cli = `import { MCE } from "@gerard2p/mce";\n\nMCE(__dirname).${opt.style === Styles.git ? 'subcommand':'command'}(process.argv);`
		
		const nPack = new PackageJSON(cliPath('templates', 'package.json'))
			.withDefaults({
				name: application,
			})
			.patchValues({
				name: application,
			description: '',
			main: `./${application}`,
			bin: {
				[application]: `./${application}`,
			},
			keywords: [
				application,
				'cmd'
			],
			author,
			license: 'MIT',
			'scripts': {
				'pkg-files': `node cpx "?(package.json|README.md|LICENSE|${application})"  lib`,
			},
			dependencies: {
				'@gerard2p/mce': `^${information().version}`
			}
		})
		tree = r(application)
		tree.w(
			c('app', application),
			c('tsconfig.json'),
			z('LICENSE', {application, year: new Date().getFullYear().toString(), author}),
			z('README.md', {application})
		)
		.d('src',
			w('cli.ts', cli),
			match(opt.style === Styles.single, c('index.ts')),
			match(opt.style === Styles.git, d('commands', c('../index.ts', 'removeme.ts'))),
		)
		.d('.vscode',
			c('launch.json'),
			c('settings.json'),
		)
		.w(	
			PackageJSON2Chain(nPack),
			c('incremental.js'),
			c('cpx.js'),
			c('jest.config.js')
		)
	})
	return tree
}
