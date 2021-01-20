import { information } from '../../src'
export async function action() {
	return {
		information: information()
	}
}