/**
 * @module @gerard2p/mce/spinner/spinner
 */
import chalk from 'chalk'
import type { WriteStream } from 'tty'
import { streams } from '../../system-streams'
import { animations } from './animations'
import { cleanColor } from '../clean-color'
import { hideCursor, showCursor } from './control'
import { isTTYSupported } from './istty'
import { wcwidth } from './wcwidth'
const TEXT = Symbol('mce_spinner')
type onlykeys<T> = keyof { [P in keyof T]: P extends string ? P: P }
export interface  ISpinnerOptions {
    color?: string
    text: string
    stream?: WriteStream
    interval?: number
    hideCursor?: boolean
    frameIndex?: number
    linesToClear?: number
    spinner?: any
}
export class Spinner {
    id: NodeJS.Timeout
    lineCount: number
    hideCursor: boolean
    options: ISpinnerOptions
    spinner: any
    get stream (): WriteStream {
		return streams.output
	}
    color: string
    interval: number
    frameIndex: number
	linesToClear: number
	get isSpinning() {
		return this.id !== null
	}
	set text(value) {
		this[TEXT] = value
		const columns = this.stream.columns || /*istanbul ignore next*/80
		this.lineCount = cleanColor('--' + value).split('\n').reduce((count, line) => {
			return count + Math.max(1, Math.ceil(wcwidth(line) / columns))
		}, 0)
	}
	get text() {
		return this[TEXT]
	}
    constructor(options: ISpinnerOptions) {
		this.options = Object.assign({
			text: '',
			color: 'cyan'
		}, options)
		this.changeSpinner('dots')
		/*istanbul ignore next*/
		if (animations[this.spinner].frames === undefined) {
			throw new Error('Spinner must define `frames`')
		}
		this.color = this.options.color
		this.hideCursor = this.options.hideCursor !== false
		this.interval = this.options.interval || this.spinner.interval || 100
		this.id = null
		this.frameIndex = 0

		// Set *after* `this.stream`
		this.text = this.options.text
		this.linesToClear = 0
	}
	changeSpinner(spinner: onlykeys<typeof animations>) {
		if (!isTTYSupported) {
			spinner = 'line'
		}
		this.spinner = spinner
		this.frameIndex = 0
	}
	frame() {
        const frames = animations[this.spinner].frames
		let frame = frames[this.frameIndex]
		/*istanbul ignore else*/
		if (this.color) {
			frame = chalk[this.color](frame)
		}
		this.frameIndex = ++this.frameIndex % frames.length
		return frame + ' ' + this.text
	}

	clear() {
		for (let i = 0; i < this.linesToClear; i++) {
			/*istanbul ignore next*/
			if (i > 0) {
				this.stream.moveCursor(0, -1)
			}
			this.stream.clearLine(0)
			this.stream.cursorTo(0)
		}
		this.linesToClear = 0

		return this
	}

	render() {
		this.stream.cursorTo(0)
		this.stream.write(this.frame())
		this.stream.clearLine(1)
		this.linesToClear = this.lineCount
		this.stream.cursorTo(0)
		return this
	}
	/**
	 * @deprecated use spin function instead
	 */
	start(text?: string) {
		/*istanbul ignore next*/
		if (text) {
			this.text = text
		}
		if (this.isSpinning) {
			return this
		}
		/*istanbul ignore else*/
		if (this.hideCursor) {
			hideCursor(this.stream)
		}
		this.render()
		this.id = setInterval(this.render.bind(this), this.interval)
		return this
	}

	stop() {
		clearInterval(this.id)
		this.id = null
		this.frameIndex = 0
		this.clear()
		/*istanbul ignore else*/
		if (this.hideCursor) {
			showCursor(this.stream)
		}
		// this.enabled = false;
		return this
	}
	public log(text: TemplateStringsArray, ...values: any[]) {
		const send = `${chalk(text, ...values)}`
		this.clear()
		this.stream.write(send)
		return this
	}
}