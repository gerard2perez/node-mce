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