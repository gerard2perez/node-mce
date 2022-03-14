import { Program } from './director'
// import { MCE } from './index'
// MCE(__dirname).gitStyle(process.argv)

Program({
	root: __dirname,
	argv: process.argv,
	plugins: 'mce',
	locals: false
})