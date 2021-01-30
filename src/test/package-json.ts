import { readFileSync } from '../mockable/fs'
import './global-jest'
export function pack(file_contents: unknown = {}) {
	readFileSync.mockReturnValueOnce(JSON.stringify(file_contents))
}