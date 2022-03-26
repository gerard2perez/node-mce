/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: trie.ts
Created:  2022-03-18T19:42:56.009Z
Modified: 2022-03-26T03:59:11.398Z
*/
 export abstract class Node {

 }
 export class TrieNode extends Node {
	public letter: string
	public nodes: Map<string, TrieNode> = new Map()
	constructor(letter = '') {
		super()
		this.letter = letter
	}
	get isEnd () {
		return this.letter === '$'
	}
	has(letter: string) {
		return this.nodes.has(letter)
	}
	get(letter: string) {
		return this.nodes.get(letter)
	}
	add(letter: string) {
		let node = this.nodes.get(letter)
		if( !node ) {
			node = new TrieNode(letter)
			this.nodes.set(letter, node)
		}
		return node
	}
	valueOf(start = ''): string[] {
		return this.nodes.has('$') ? undefined : Array.from(this.nodes).reduce( (result, [letter, node]) => {
			result.push(...(node.valueOf()||['']).map(line => start + letter + line))
			return result
		}, [] as string[])
	}
	toString() {
		return JSON.stringify(this.valueOf().filter(f => f), null, 2)
	}

 }

 export class Trie {
	private root: TrieNode = new TrieNode()
	insert(word: string) {
		let current = this.root
		if(!word) return this
		for(const letter of word) {
			current = current.add(letter)
		}
		current.add('$')
		return this
	}
	search(word: string) {
		let current = this.root
		if(!word) return current
		for(const letter of word) {
			if(current.has(letter)) {
				current = current.get(letter)
			} else {
				return null
			}
		}
		return current
	}
	toString() {
		return JSON.stringify(this.root.valueOf(), null, 2)
	}
 }
