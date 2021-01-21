/**
 * @module @gerard2p/mce/spinner
 */
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
		if(success){
			MainSpinner.succeed(success)
			return success
		} else {
			MainSpinner.stop()
		}
	}).catch( /*istanbul ignore next*/ (err: Error) => {
		MainSpinner.stop()
		throw err
	})
}