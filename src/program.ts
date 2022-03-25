import { PackageJSON } from './@utils/package-json'
import { dirname, join, resolve } from 'path'
import { cliPath } from './fs'
let _node_location: string
let program_location: string
export function locations(node: string, program: string) {
	_node_location = node
	program_location = program
}
export interface IPackage {
	name: string,
	/**
	 * relative path to bins
	 */
	bin: {
		[key: string]: string
	}
	/**
	 * relative path
	 */
	main: string
	version: string
	installation_dir: string
	dependencies: Record<string, string>
	devDependencies: Record<string, string>
}
export function information(location = cliPath('package.json')) {
	location = resolve(location.replace('src', ''))
	const packageInformation = new PackageJSON(location) || {bind: {}} as any
	const { bin = {}} = packageInformation
	const installationPath = dirname(program_location)
	for(const key of Object.keys(bin)) {
		packageInformation.bin[key] =  join(installationPath, packageInformation.bin[key])
    }
    return {
        name: packageInformation.name, 
        bin: packageInformation.bin,
        main: packageInformation.main,
		version: packageInformation.version,
		installation_dir: installationPath,
		dependencies: packageInformation.dependencies,
		devDependencies: packageInformation.devDependencies
    } as IPackage
}