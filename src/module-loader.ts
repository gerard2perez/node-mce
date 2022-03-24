/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: module-loader.ts
Created:  2022-03-17T04:30:50.811Z
Modified: 2022-03-24T19:01:38.254Z
*/
import { basename } from 'path'
import { Command as OldCommand, Option as OldOption, OptionKind, Parser} from './legacy_core'
import { Argument, Command, Insert, mArguments, mDescription, mOptions, Option } from './core'
import 'reflect-metadata'
export type Ctor =  new () => Command
export async function LoadModule(path: string, forcedName?: string): Promise<Ctor|undefined> {
	const fname = basename(path)
	return await import(path).then(m => {
		const { action, default: compileClass } = m
		if( action ) {
			const {[fname]: runtimeClass} = {
				[fname]: class extends Command {
					public _legacyOptions = {}
					action = m.action
				}
			}
			const ocmd = new OldCommand('mce', basename(path), m, false)
			for(const oArg of ocmd.arguments) {
				if(oArg.type==='bool')oArg.type = 'boolean'
				const nArg = new Argument({
					defaults: undefined,
					kind: oArg.kind === OptionKind.varidac ? `${oArg.type}[]` : oArg.type as any,
					optional: oArg.kind === OptionKind.optional,
					rest: oArg.kind === OptionKind.varidac,
					property: oArg.name
				}, null, ocmd.arguments.indexOf(oArg))
				
				Insert( mArguments, nArg, runtimeClass.prototype )
			}
			for(const oOpt of ocmd.options) {
				
				const meta: any = {
					defaults: oOpt.defaults,
					kind: oOpt.validation ? oOpt.validation : undefined,
					isEnum: !!oOpt.validation,
					property: oOpt.name,
				}
				applyKindFixtures(oOpt, meta)
				const nArg = new Option(meta, oOpt.description, oOpt.short)
				Insert( mOptions, nArg, runtimeClass.prototype )
			}
			if(ocmd.description) {
				Reflect.defineMetadata(mDescription, ocmd.description, runtimeClass)
			}
			Insert(
				mOptions,
				new Option(
					{kind: 'boolean', defaults: false, property: 'help'},
					'Displays help for the command',
					'-h'
				),
				runtimeClass.prototype
			)
			return runtimeClass
		}
		return compileClass
	}).then(module => {
		Reflect.defineMetadata(Command, forcedName || fname, module.prototype)
		return module
	}).catch(_ => {
		throw _
	})
}

function applyKindFixtures(oOpt: OldOption<any>, meta: { isEnum: boolean,  defaults: any; kind: any; property: string }) {
	switch (oOpt.parser) {
		case Parser.enum:
			
			// meta.kind = 'enum'
			break
		case Parser.increaseVerbosity:
			meta.kind = 'verbosity'
			break
		case Parser.int:
			meta.kind = 'int'
			break
		case Parser.float:
			meta.kind = 'float'
			break
		case Parser.range:
			meta.kind = 'range'
			break
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
			if(!meta.isEnum) {
				meta.kind = 'string'
			}
			break
	}
}
