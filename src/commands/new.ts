import { error, SetSpinnerText, spin } from '../output'
import { override } from '../input'
import { cpy, dir, match, PackageJSON2Chain as pkg, wrt, cmp, root } from '../tree-maker'
import { callerPath, cliPath, copy } from '../fs'
import { SpawnOptions } from 'child_process'
import { alias, arg, Command, description, DryRun, opt, Options } from '../core'
import { PackageJSON } from '../@utils/package-json'
import { exec } from '../spawn'

function dryExec<T>(cmd: string, cmdOptions: string[], options?: SpawnOptions) {
	return function(onErrorReturn: T, wait_ms?: number, dryRunReturn = '') {
		return exec(cmd, cmdOptions, options)
			.data(chunck => SetSpinnerText(chunck.toString()))
			.error()
			.dryRun(dryRunReturn, wait_ms)
			.run()
			.then(result => result.toString(), _ => onErrorReturn)
	}
}
enum Styles {
	git,
	single
}

let nproy
async function createProjectExtructure(application: string, opt: Options<NewCommand>) {
	let { author } = opt
	await spin('Creating Files', async () => {
		// istanbul ignore else
		if(author === 'GIT_OR_NPM_USER') {
			let git_user: any = await dryExec('git', ['config', 'user.name'], {})('', 0, 'git')
			const git_email: any = await dryExec('git', ['config', 'user.email'], {})('', 0, 'git@git.com')
			/* istanbul ignore else */
			if(!git_user) git_user = await dryExec('npm', ['whoami'], {})('', 0, '')
			author = `${git_user.trim()} <${git_email.trim()}>`
		}
		const cli = `import { MCE } from "@gerard2p/mce";\n\nMCE(__dirname).${opt.style === Styles.git ? 'subcommand':'command'}(process.argv);`
		const nPack = new PackageJSON(cliPath('templates', 'package.json'))
			.withDefaults({
				name: application,
			})

			nPack.patchValues({
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
				dependencies: {
					'@gerard2p/mce': `^${nPack.version}`
				}
			})
		root(application,
			cpy('app', application),
			cpy('tsconfig.json'),
			cpy('.eslintrc.json'),
			cmp('LICENSE', {application, year: new Date().getFullYear().toString(), author}),
			cmp('README.md', {application}),
			dir('src',
				wrt('cli.ts', cli),
				match(opt.style === Styles.single, cpy('index.ts')),
				match(opt.style === Styles.git, dir('commands', cpy('../index.ts', 'removeme.ts'))),
			),
			dir('.vscode',
				cpy('launch.json'),
				cpy('settings.json'),
				cpy('extensions.json'),
			),
			pkg(nPack),
			cpy('jest.config.js')
		)
	})
}
@alias('n')
@description('Creates a new MCE project.')
export default class NewCommand extends Command {
	@opt('a', 'Author of the package') author = 'GIT_OR_NPM_USER'
	@opt('f', 'Overrides target directory') force: boolean
	@opt('n', 'Install npm dependencies') npm: boolean
	@opt('s', 'Define the style of command you will use. If you need more than one command use git.') style = Styles.single
	@opt dryRun: DryRun
	async action( @arg application: string ) {
		nproy = callerPath.bind(null, application)
		if(!await override('Directory already exist. Do you want to override it', nproy(), this.force))
			return
		await createProjectExtructure(application, this)
		this.npm && await spin('Initializing npm', async() => {
			const npmResult = await dryExec('npm', ['install', '-S'], {cwd: nproy()})(false, 1000)
			if (npmResult === false ) {
				error`npm installation failed`
			}
		})
		await spin('Initializing git', async() => {
			const initResult = await dryExec('git', ['init'], {cwd: nproy()})(false, 1000)
			if ( initResult === false ) {
				error`git init`
			}
			copy('gitignore', `${application}/.gitignore`)
		})
		return 0
	}
	
}
