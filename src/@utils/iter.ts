export function iter<T=any>(obj: any) {
	obj[Symbol.iterator] = function () {
		const keys = Object.keys(this)
		const data: {[p: string]: T} = Object.assign({}, this)
		const total = keys.length
		return { i: 0,
			next() {
				const current = this.i
				const key = keys[current]
				return {
					value: [
						key,
						data[key],
						current,
						total
					],
					done: this.i++ === total
				}
			}
		}
	}
    return obj as {
		[Symbol.iterator](): {
			next(): IteratorResult<[string, T, number, number]>
		}
	}
}
