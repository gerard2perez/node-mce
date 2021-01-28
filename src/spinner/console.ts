/**
 * @module @gerard2p/mce/console
 */
import { MainSpinner } from '.'
/**
 * @deprecated use the one from gerard2p/mce/control
 */
export const pause = () => {
    MainSpinner.stop()
}
/**
 * @deprecated use the one from gerard2p/mce/control
 */

export const resume = () => {
    MainSpinner.start()
}
export function SetSpinnerText(text: string|Buffer) {
    MainSpinner.text = text
}
