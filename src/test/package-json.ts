import { readFileSync } from '../mockable/fs'
import './global-jest'
export function pack(file_contents: Record<string, unknown> = {}) {
	readFileSync.mockReturnValueOnce(JSON.stringify(file_contents))
}