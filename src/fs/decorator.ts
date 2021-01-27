/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PROJECT, TEMPLATE } from './resolvers'
export type RawFunction = (...args: unknown[]) => void
export function RegisterDryRun<T extends RawFunction>(raw: T) {
	function bound (...args: Parameters<T>) {
		return raw.bind({
			...{
				project: PROJECT,
				template: TEMPLATE
			},
			...this,
		})(...args) as ReturnType<T>
	}
	return bound
}
