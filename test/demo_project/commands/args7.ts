import { numeric, Parsed } from '@gerard2p/mce'
export const description = 'A description for your command'
export const options = {
    number: numeric('-n', 'A number', 10),
    number2: numeric('-n', 'A number2', 2)
}
export async function action(opt: Parsed<typeof options>) {
	return opt
}