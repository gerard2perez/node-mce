/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: help.ts
Created:  2022-01-31T06:31:09.268Z
Modified: 2022-03-23T21:30:22.810Z
*/
import { write } from '../console'
import { Command, Option, Argument, mDescription, getMetadata, mAlias } from '../core'
import { Color, Background } from '../formatters'
export interface HelpTheme {
	description: {
		primary: [Color, Background?],
		secondary: [Color, Background?]
	}
	command: [Color, Background?]
	argument: {
		primary: [Color, Background?],
		secondary: [Color, Background?]
	}
	option: {
		primary: [Color, Background?],
		secondary: [Color, Background?]
	}

}

export abstract class HelpRenderer {
	constructor(protected theme: HelpTheme) {}
	protected pipe(pallete: [Color, Background?]) {
		return pallete.join('|')
	}
	header(program: string, single: boolean, command: Command) {
		const _arguments: Argument[] = Argument.Get(command)
		const _options: Option[] =   Option.Get(command)
		const pre = `${program} ${single ? '' : Command.getName(command)}`.trim()
		const args = _arguments.map(arg => `${arg.rest?'...':''}{${arg.name}|${this.pipe(this.theme.argument.primary)}}{:${arg.oKind}|${this.pipe(this.theme.argument.secondary)}}`).join(' ')
		const opts = _options.length ? `{[options]|${this.pipe(this.theme.option.primary)}}` : ''
		return `{${pre}|${this.pipe(this.theme.command)}} ${args} ${opts}`.trim()
	}
	arguments(argument: Argument, fill: number) {
		return `{${argument.name}|padr:${fill}|${this.pipe(this.theme.argument.primary)}}{${argument.description}}`
	}
	options(option: Option, indent: number, longTagSize: number): string {
		const shotTagLen = 4
		const padtoDesc =  longTagSize + shotTagLen
		const primary = this.pipe(this.theme.option.primary)
		const secondary = this.pipe(this.theme.option.secondary)
		const dprimary = this.pipe(this.theme.description.primary)
		let defData = `${option.defaults||''}`
		defData = defData ? `{Default:|${secondary}} {${option.defaults}|red}` : ''
		const short = option.short ? `{${option.short}|${primary}}{,|${secondary}} `: ''
		if(defData) {
			defData = `\n{|padl:${indent+padtoDesc+shotTagLen}}${defData}\n`
		}
		if(option.oKind ==='boolean' && option.defaults !== 'true') defData = ''
		let namedTag = `{${option.tag}|${secondary}}`
		if(option.hasValue) {
			if(option.oKind === 'range') {
				namedTag = `${namedTag} {<a>..<b>|${dprimary}}`

			} else if(option.oKind === 'verbosity' || option.oKind === 'boolean') {
				namedTag = `${namedTag}`
			} else {
				namedTag = `${namedTag} {<${option.name}>|${dprimary}}`
			}
		}
		const line1 = `{${short}|padl:${shotTagLen}}{${namedTag}|padr:${padtoDesc}}`
		const desc = option.description ? `{${option.description||''}|autowrap:${indent+padtoDesc+shotTagLen}|${secondary}}` : ''
		
		return `{|padl:${indent}}${line1}${desc}${defData}`
	}
	command(program: string, command?: string) {

		if(command) {
			return `{${program}|yellow} {${command}|${this.theme.command[0]}}`
		} else {
			return `    {${program}|${this.theme.command[0]}}`
		}
	}
	render(program: string, commands: Command[], single = false) {
		const help = commands.map(command => this.generateHelp(program, command, single && commands.length === 1))
		write`${help.join('\n')}\n`
	}
	/**
	 * Return and uncompiled command help
	 * @param program 
	 * @param command 
	 * @param single 
	 * @returns 
	 */
	generateHelp(program: string, command: Command, single = false, ident = 4) {
		const description = getMetadata(mDescription, command)
		const alias = getMetadata(mAlias, command)
		const argus = Argument.Get(command)
		const options = Option.Get(command)
		let help = `{|padl:${ident}}${this.header(program, single, command)}\n`
		if(alias) {
			help += `{|padl:${ident+1}}{Alias:|${this.pipe(this.theme.description.primary)}} {${alias}|${this.pipe(this.theme.command)}}\n`
		}
		if(description) {
			help += `{|padl:${ident+2}}{${description}|${this.pipe(this.theme.description.primary)}}\n`
		}
		
		const args_fill = argus.map(opt => opt.name.length).sort().pop() + 3
		const str_args = argus.filter(f => f.description).map(arg => `{|padl:${ident+3}}${this.arguments(arg, args_fill)}`).join('\n')
		if(str_args.length) {
			help += `${str_args}\n`
		}
		const [fill] = options.map(opt => opt.tag.length + (opt.hasValue ? opt.tag.length : 0)).sort((a, b) => b - a)
		const str_options = options.map(option => this.options(option, ident+4, fill)).join('\n')
		help += `${str_options}`
		return help
	}

}