/**
 * @module @gerard2p/mce/spinner
 */
import { ok } from '../console'
import { ISpinnerOptions, Spinner } from './spinner'
/** @ignore */
export const MainSpinner = new Spinner({text: ''})
export function wait(time=1000) {
	return new Promise((resolve) => {
		setTimeout(resolve, time)
	})
}
export async function spin(display: string | ISpinnerOptions, fn: () => Promise<string|void>): Promise<string|void> {
	MainSpinner.text = display
	MainSpinner.start()
	return fn().then(success => {
		MainSpinner.stop()
		if(success){
			ok`${success}`
			return success
		}
	}).catch( /*istanbul ignore next*/ (err: Error) => {
		MainSpinner.stop()
		throw err
	})
}