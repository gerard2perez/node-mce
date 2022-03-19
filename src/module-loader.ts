/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: module-loader.ts
Created:  2022-03-17T04:30:50.811Z
Modified: 2022-03-19T02:36:15.888Z
*/
import { basename } from 'path'
import { Command as OldCommand, OptionKind, Parser} from './legacy_core'
import { Argument, Command, Insert, mArguments, mOptions, Option } from './core'
import 'reflect-metadata'
export type Ctor =  new () => Command
export async function LoadModule(path: string): Promise<Ctor|undefined> {
	const fname = basename(path)
	return await import(path).then(m => {
		const { action, default: compileClass } = m
		if( action ) {
			const {[fname]: runtimeClass} = {
				[fname]: class extends Command {
					public _legacyOptions = {}
					async action(...args: any[]) {
						await m.action(...args)
					}
				}
			}
			const ocmd = new OldCommand('mce', basename(path), m, false)
			for(const oArg of ocmd.arguments) {
				const nArg = new Argument({
					defaults: undefined,
					kind: oArg.type as any,
					optional: oArg.kind === OptionKind.optional,
					rest: oArg.kind === OptionKind.varidac,
					property: oArg.name
				}, null, ocmd.arguments.indexOf(oArg))
				Insert( mArguments, nArg, runtimeClass.prototype )
			}
			for(const oOpt of ocmd.options) {
				const meta = {
					defaults: oOpt.defaults,
					kind: undefined,
					property: oOpt.name,
				}
				switch(oOpt.parser) {
					case Parser.list:
						meta.kind = 'List<string>'
						break
					case Parser.collect:
						meta.kind = 'Collection<string>'
						break
					case Parser.truefalse:
						meta.kind = 'boolean'
						break
					default:
						meta.kind = 'string'
						break
				}
				const nArg = new Option(meta, oOpt.tag_desc, oOpt.short)
				Insert( mOptions, nArg, runtimeClass.prototype )
			}
			Insert(
				mOptions,
				new Option(
					{kind: 'boolean', defaults: undefined, property: 'help'},
					'',
					'-h'
				),
				runtimeClass.prototype
			)
			return runtimeClass
		}
		return compileClass
	}).then(module => {
		Reflect.defineMetadata(Command, fname, module.prototype)
		return module
	}).catch(_ => {
		throw _
	})
}