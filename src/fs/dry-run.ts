export function dryRun<T extends (...args: unknown[]) => unknown>(action: T, replaceWith: (...args: Parameters<T>) => ReturnType<T> = () => undefined ) {
	if(process.env.MCE_DRY_RUN==='true') {
		return replaceWith
	} else {
		return action
	}
}