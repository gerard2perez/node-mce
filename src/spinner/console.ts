/**
 * @module @gerard2p/mce/console
 */
import { MainSpinner } from '.'
export function SetSpinnerText(text: string|Buffer) {
    MainSpinner.text = text
}
