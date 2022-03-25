import { Program } from './director'
new Program(__dirname).execute(process.argv, {
	plugins: 'mce',
	silentError: true
})