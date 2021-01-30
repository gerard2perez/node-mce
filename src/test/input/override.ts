import '../global-jest'
import { existsSync, lstatSync, readdirSync } from '../../mockable/fs'
export function mockOverride(status: boolean, force: boolean, tree = []) {
	if(!force) {
		existsSync.mockReturnValueOnce(true)
	}
	if(status || force) {
		existsSync.mockReturnValueOnce(true)
		lstatSync.mockReturnValueOnce({
			isDirectory () { return true }
		})
		readdirSync.mockReturnValueOnce(tree)
	}
}