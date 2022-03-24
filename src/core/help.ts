/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: help.ts
Created:  2022-01-31T06:31:09.268Z
Modified: 2022-03-24T04:05:55.889Z
*/
import { write } from '../console'
import { Command, Option, Argument, mDescription, getMetadata, mAlias } from '../core'
import { Color, Background } from '../formatters'
export interface HelpTheme {
	description: {
		primary: [Color, Background?],
		secondary: [Color, Background?]
	}
	command: {
		primary: [Color, Background?]
		secondary: undefined
	}
	argument: {
		primary: [Color, Background?],
		secondary: [Color, Background?]
	}
	option: {
		primary: [Color, Background?],
		secondary: [Color, Background?]
	}

}
type HelpKey = keyof HelpTheme
export abstract class HelpRenderer {
	constructor(protected theme: HelpTheme) {}
	protected colorHelper(key: HelpKey) {
		const pallete = this.theme[key]
		return {
			primary: pallete.primary.join('|'),
			secondary: pallete.secondary ? pallete.secondary.join('|') : undefined
		}
	}
	header(program: string, single: boolean, command: Command) {
		const { primary: cargument, secondary: bargument } = this.colorHelper('argument')
		const { primary: coption } = this.colorHelper('option')
		const { primary: ccommand } = this.colorHelper('command')
		const _arguments: Argument[] = Argument.Get(command)
		const _options: Option[] =   Option.Get(command)
		const pre = `${program} ${single ? '' : Command.getName(command)}`.trim()
		const args = _arguments.map(arg => `${arg.rest?'...':''}{${arg.name}|${cargument}}{:${arg.oKind}|${bargument}}`).join(' ')
		const opts = _options.length ? `{[options]|${coption}}` : ''
		return `{${pre}|${ccommand}} ${args} ${opts}`.trim()
	}
	arguments(argument: Argument, fill: number) {
		const {primary} = this.colorHelper('argument')
		return `{${argument.name}|padr:${fill}|${primary}}{${argument.description}}`
	}
	options(option: Option, indent: number, longTagSize: number): string {
		const shotTagLen = 4
		const padtoDesc =  longTagSize + shotTagLen
		const { primary, secondary } = this.colorHelper('option')
		const { primary: dprimary } = this.colorHelper('description')
		const tagParser = option.tagParsers()
		let defData = `${option.defaults||''}`
		defData = defData ? `{Default:|${secondary}} {${option.defaults}|red}` : ''
		const short = option.short ? `{${option.short}|${primary}}{,|${secondary}} `: ''
		if(defData) {
			defData = `\n{|padl:${indent+padtoDesc+shotTagLen}}${defData}\n`
		}
		if(option.oKind ==='boolean' && option.defaults !== 'true') defData = ''
		const [longTag, tagParam = ''] = tagParser(option.name)
		let namedTag = `{${longTag}|${secondary}}`
		if(option.hasValue) {
			namedTag = `${namedTag} {${tagParam}|${dprimary}}`
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
		const { primary } = this.colorHelper('description')
		const { primary: cprimary } = this.colorHelper('command')
		const description = getMetadata(mDescription, command)
		const alias = getMetadata(mAlias, command)
		const argus = Argument.Get(command)
		const options = Option.Get(command)
		let help = `{|padl:${ident}}${this.header(program, single, command)}\n`
		if(alias) {
			help += `{|padl:${ident+1}}{Alias:|${primary}} {${alias}|${cprimary}}\n`
		}
		if(description) {
			help += `{|padl:${ident+2}}{${description}|${primary}}\n`
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