import { List, Option, Parser, Range } from './option'

interface CommandOptions {
	[p: string]:
		| Option<number>
		| Option<Range>
		| Option<boolean>
		| Option<string>
		| Option<Range>
		| Option<List>;
}
export type Parsed<T extends CommandOptions> = {
	readonly [P in keyof T]: T[P] extends Option<infer R> ? R : never;
}
function preOptions<T>(
	parser: Parser,
	option: string,
	description: string,
	exp: RegExp | any = undefined,
	defaults: any = undefined
) {
	if (arguments.length === 4 && !(exp instanceof RegExp)) {
		defaults = exp
		exp = undefined
	}
	switch (parser) {
		case Parser.truefalse:
			defaults = false
			break
		case Parser.increaseVerbosity:
			defaults = 0
			break
		case Parser.collect:
		case Parser.list:
		case Parser.range:
			defaults = defaults || []
			break
	}
	return new Option<T>(option, description, parser, exp, defaults)
}
export function enumeration<T extends string[]>(
	option: string,
	description: string,
	options: T,
	defaults?: T[number]
): Option<T[number]>
export function enumeration<T>(
	option: string,
	description: string,
	options: any,
	defaults?: T
): Option<T>
export function enumeration(
	option: string,
	description: string,
	options: any,
	defaults?: any
) {
	const raw = options
	if (!(options instanceof Array)) {
		options = Object.keys(options).map((k) => options[k]) as (
			| string
			| number
		)[]
	}
	const bound = (Parser.enum as any).bind(null, raw)
	bound.isEnum = Parser.enum
	return preOptions(bound, option, description, options, defaults)
}
export function numeric(
	option: string,
	description: string,
	exp: RegExp,
	defaults?: number
): Option<number>
export function numeric(
	option: string,
	description: string,
	defaults?: number
): Option<number>
export function numeric(...args: [string, string, RegExp | number, number?]) {
	return preOptions<number>(Parser.int, ...args)
}
export function floating(
	option: string,
	description: string,
	exp: RegExp,
	defaults?: number
): Option<number>
export function floating(
	option: string,
	description: string,
	defaults?: number
): Option<number>
export function floating(
	...args: [string, string, RegExp | number, number?]
): Option<number> {
	return preOptions<number>(Parser.float, ...args)
}
export function range(
	option: string,
	description: string,
	exp: RegExp,
	defaults?: Range
): Option<Range>
export function range(
	option: string,
	description: string,
	defaults?: Range
): Option<Range>
export function range(...args: [string, string, RegExp | Range, Range?]) {
	return preOptions<Range>(Parser.range, ...args)
}
export function text(
	option: string,
	description: string,
	exp: RegExp,
	defaults?: string
): Option<string>
export function text(
	option: string,
	description: string,
	defaults?: string
): Option<string>
export function text(...args: [string, string, RegExp | string, string?]) {
	return preOptions<string>(Parser.string, ...args)
}
export function list(
	option: string,
	description: string,
	exp: RegExp,
	defaults?: List
): Option<List>
export function list(
	option: string,
	description: string,
	defaults?: List
): Option<List>
export function list(...args: [string, string, RegExp | List, List?]) {
	return preOptions<List>(Parser.list, ...args)
}
export function collect(
	option: string,
	description: string,
	exp: RegExp,
	defaults?: List
): Option<List>
export function collect(
	option: string,
	description: string,
	defaults?: List
): Option<List>
export function collect(...args: [string, string, RegExp | List, List?]) {
	return preOptions<List>(Parser.collect, ...args)
}

export function bool(short: string, description: string): Option<boolean> {
	return preOptions(Parser.truefalse, short, description)
}
export function dry(description?: string): Option<boolean> {
	return preOptions(
		Parser.truefalse,
		'',
		description ||
			'Executes the program with out touching the disc or calling shell scripts'
	)
}
export function verbose(desciprtion?: string): Option<number> {
	return preOptions(Parser.increaseVerbosity, '-v', desciprtion)
}
