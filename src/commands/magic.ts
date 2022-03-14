/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential
w
File: magic.ts
Created:  2022-01-30T04:28:56.551Z
Modified: 2022-03-14T19:48:52.441Z
*/
import { alias, arg, Collection, Command, description, Float, List, opt } from '../core'
@alias('n')
@description('Esto es increible')
export default class MagicCMD extends Command {
	@opt('f') force: boolean
	// @opt('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
	// csa = 1
	@opt('a', 'The Students Ages') ages: List<Float> = [1.1, 2.2]
	@opt('i', 'Ips') ips: Collection<string>
	async action(
		@arg('This is the sesamo street') street = 115,
		@arg('The Students Ages') age: Float = 1.1,
		@arg('ala') ...colina: string[]
	) {	
		// const { ages, ips, csa, force} = this
		console.log('DONE')
	}
}
