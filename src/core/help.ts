/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: help.ts
Created:  2022-01-31T06:31:09.268Z
Modified: 2022-03-17T05:56:42.510Z
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
	header(program: string, command: string, _arguments: Argument[], options: Option[]) {
		const pre = `${program} ${command}`.trim()
		const args = _arguments.map(arg => `${arg.rest?'...':''}{${arg.name}|${this.pipe(this.theme.argument.primary)}}{:${arg.oKind}|${this.pipe(this.theme.argument.secondary)}}`).join(' ')
		const opts = options.length ? `{[options]|${this.pipe(this.theme.option.primary)}}` : ''
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
		let defautls = option.defaults ? `{Default:|${secondary}}{${option.defaults}|red}\n` : '' 
		const short = option.short ? `{${option.short}|${primary}}{,|${secondary}} `: ''
	
		if(option.description) {
			defautls = `{|padl:${indent+padtoDesc+shotTagLen}}${defautls}`
		}
		
		let namedTag = `{${option.tag}|${secondary}}`
		if(option.hasValue) {
			namedTag = `${namedTag} {<${option.name}>|${dprimary}}`
		}
		const line1 = `{${short}|padl:${shotTagLen}}{${namedTag}|padr:${padtoDesc}}`
		const desc = option.description ? `{${option.description||''}|autowrap:${indent+padtoDesc+shotTagLen}|${secondary}}\n` : ''
		// return [
		// 	`${line1}` + desc + `${defautls}`,
			
		// ].filter(f => f).map(line => 
		return `{|padl:${indent}}${line1}${desc}${defautls}`
	}
	command(program: string, command?: string) {

		if(command) {
			return `{${program}|yellow} {${command}|${this.theme.command[0]}}`
		} else {
			return `    {${program}|${this.theme.command[0]}}`
		}
	}
	render(program: string, commands: Command[], single = false) {
		const help = commands.map(command => this.renderCommand(program, command, single && commands.length === 1))
		write`${help.join('\n')}\n`
	}
	
	renderCommand(program: string, command: Command, single = false) {
		const indent = 0
		const description = getMetadata(mDescription, command)
		const alias = getMetadata(mAlias, command)
		const argus = Argument.Get(command)
		const options = Option.Get(command)// getMetadata<Option[]>(mOptions, command)
		let help = `{|padl:${indent}}${this.header(program, single ? '' : Command.getName(command), argus, options)}\n`
		if(alias) {
			help += `{|padl:${indent+1}}{Alias:|${this.pipe(this.theme.description.primary)}} {${alias}|${this.pipe(this.theme.command)}}\n`
		}
		if(description) {
			help += `{|padl:${indent+1}}{${description}|${this.pipe(this.theme.description.primary)}}\n`
		}
		
		const args_fill = argus.map(opt => opt.name.length).sort().pop() + 3
		const str_args = argus.filter(f => f.description).map(arg => `{|padl:${indent+3}}${this.arguments(arg, args_fill)}`).join('\n')
		if(str_args.length) {
			help += `${str_args}\n`
		}
		const fill = options.map(opt => opt.tag.length + (opt.hasValue ? opt.name.length + 2 + 1 : 0)).sort().shift() + 2
		const str_options = options.map(option => this.options(option, indent+3, fill)).join('\n')
		help += `${str_options}`
		return help
	}

}