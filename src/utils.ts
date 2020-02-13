/**
 * @module @gerard2p/mce/utils
 */
/** @ignore */
export function iter<T=any>(obj: any) {
	obj[Symbol.iterator] = function () {
		let keys = Object.keys(this);
		let data:{[p:string]:T} = this;
		let total = keys.length;
		return { i: 0,
			next() {
				let current = this.i;
				let key = keys[current];
				return {
					value: [
						key,
						data[key],
						current,
						total
					],
					done: this.i++ === total
				};
			}
		};
	}
    return obj as {
		[Symbol.iterator]():{
			next(): IteratorResult<[string, T, number, number]>
		}
	 };
}
export * from './paths';
export { remove } from './remove';
export { render } from './render';
export { rawSpawn, spawn, spinSpawn } from './spawn';

