/**
 * @module @gerard2p/mce/console
 */
import { MainSpinner } from '.'
export const pause = () => {
    MainSpinner.stop()
}

export const resume = () => {
    MainSpinner.start()
}
export function updateTextSpin(text: string|Buffer) {
    MainSpinner.text = text
}
