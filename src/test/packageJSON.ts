import { readFileSync } from '../mockable/fs'
import '@gerard2p/mce/test/global.jest'
export function pack(file_contents: unknown = {}) {
	readFileSync.mockReturnValueOnce(JSON.stringify(file_contents))
}