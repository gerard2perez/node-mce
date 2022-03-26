import type { WriteStream } from 'tty'
import { MainSpinner } from '.'
import { isTTYSupported } from './istty'
const settings = {
	isCursorHidden: false,
	showOnExit: false
}
export function showCursor(stream: WriteStream) {
	/*istanbul ignore next*/
	if (!isTTYSupported) {
		return
	}
	settings.isCursorHidden = false
	stream.write('\u001b[?25h')
}

export function hideCursor(stream: WriteStream) {
	/*istanbul ignore next*/
	if (!isTTYSupported) {
		return
	}
	if(!settings.showOnExit) {
		settings.showOnExit = true
		/*istanbul ignore next*/
		process.once('beforeExit', () => {
			stream.write('\u001b[?25h')
		})
	}
	settings.isCursorHidden = true
	stream.write('\u001b[?25l')
}
export const pause = () => {
    MainSpinner.stop()
}

export const resume = () => {
    MainSpinner.start()
}