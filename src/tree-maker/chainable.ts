// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface chainable {}
export interface Chainable {
	fn: any
	args: any[]
}
export function makeChainable<T extends (...args: unknown[]) => unknown>(fn: T) {
	function wrapper(...args: any[]) {
		return {
			id: fn.name,
			fn,
			args,
		}
	}
	return wrapper.bind({ fn }) as (...pams: Parameters<T>) => chainable
}
  