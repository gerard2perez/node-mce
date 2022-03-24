/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: decorator.ts
Created:  2022-03-24T02:31:16.043Z
Modified: 2022-03-24T03:28:19.110Z
*/

export function WrapDecorator(fn: (...args: unknown[]) => boolean, decorator: (...args: unknown[]) => unknown) {
	return function DecoratorRouter(...args: unknown[]): PropertyDecorator {
		if(fn(...args)) {
			decorator(...args)
		} else {
			return function NoArgsDecorator( target: unknown, propertyKey: string ) {
				decorator(target, propertyKey, ...args)
			}
		}
	}
}