#!/usr/bin/env node
import { CLIExecuter } from './executer'
new CLIExecuter(__dirname, 'mce').execute(process.argv, {
	plugins: 'mce',
	silentError: true
})
