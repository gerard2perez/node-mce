/**
 * @module @gerard2p/mce/spinner
 */
import { animations } from './animations';
import chalk from 'chalk';
import { LogSymbols, supported } from './symbols';
import { stripAnsi } from './strip-ansi';
import { wcwidth } from './wcwidth';
import { Cursor } from './cursor';


const TEXT = Symbol('mce_spinner');

export interface  ISpinnerOptions {
    color?:string
    text:string
    stream?: any
    interval?:number
    hideCursor?:boolean
    enabled?:boolean
    frameIndex?:number
    linesToClear?:number
    spinner?:any
}
export class Spinner {
    id:NodeJS.Timeout
    lineCount: number;
    hideCursor:boolean
    options:ISpinnerOptions
    spinner:any
    stream: any
    color:string
    interval:number
    enabled:boolean
    frameIndex:number
	linesToClear:number
	get text() {
		return this[TEXT];
	}
	get isSpinning() {
		return this.id !== null;
	}
	set text(value) {
		this[TEXT] = value;
		const columns = this.stream.columns || /*istanbul ignore next*/80;
		this.lineCount = stripAnsi('--' + value).split('\n').reduce((count, line) => {
			return count + Math.max(1, Math.ceil(wcwidth(line) / columns));
		}, 0);
	}
    constructor(options:ISpinnerOptions) {
		this.options = Object.assign({
			text: '',
			color: 'cyan',
			stream: process.stderr
		}, options);
		this.changeSpinner('dots');
		/*istanbul ignore next*/
		if (animations[this.spinner].frames === undefined) {
			throw new Error('Spinner must define `frames`');
		}
		this.color = this.options.color;
		this.hideCursor = this.options.hideCursor !== false;
		this.interval = this.options.interval || this.spinner.interval || 100;
		this.stream = this.options.stream;
		this.id = null;
		this.frameIndex = 0;
		this.enabled = typeof this.options.enabled === 'boolean' ? /*istanbul ignore next*/this.options.enabled : ((this.stream && this.stream.isTTY));

		// Set *after* `this.stream`
		this.text = this.options.text;
		this.linesToClear = 0;
	}
	changeSpinner(spinner:string) {
		/*istanbul ignore next*/
		if (supported || process.env.ANSICON) {
			
		} else if (['line', 'line2', 'pipe', 'simpleDots','simpleDotsScrolling','star2','flip','balloon', 'balloon2', 'noise','boxBounce2','toggle3','toggle4','toggle13','arrow','bouncingBar','shark','layer'].includes(spinner)) {

		} else {
			spinner = 'line'
		}
		this.spinner = spinner;
		this.frameIndex = 0;
	}
	frame() {
        const frames = animations[this.spinner].frames;
		let frame = frames[this.frameIndex];
		/*istanbul ignore else*/
		if (this.color) {
			frame = chalk[this.color](frame);
		}
		this.frameIndex = ++this.frameIndex % frames.length;
		return frame + ' ' + this.text;
	}

	clear() {
		/*istanbul ignore next*/
		if (!this.enabled) {
			return this;
		}

		for (let i = 0; i < this.linesToClear; i++) {
			/*istanbul ignore next*/
			if (i > 0) {
				this.stream.moveCursor(0, -1);
			}
			this.stream.clearLine();
			this.stream.cursorTo(0);
		}
		this.linesToClear = 0;

		return this;
	}

	render() {
		this.clear();
		this.stream.write(this.frame());
		this.linesToClear = this.lineCount;

		return this;
	}

	start(text?:string) {
		/*istanbul ignore next*/
		if (text) {
			this.text = text;
		}
		if (!this.enabled || this.isSpinning) {
			return this;
		}
		/*istanbul ignore else*/
		if (this.hideCursor) {
			Cursor.hide(this.stream);
		}
		this.render();
		this.id = setInterval(this.render.bind(this), this.interval);
		return this;
	}

	stop() {
		/*istanbul ignore next*/
		if (!this.enabled) {
			return this;
		}

		clearInterval(this.id);
		this.id = null;
		this.frameIndex = 0;
		this.clear();
		/*istanbul ignore else*/
		if (this.hideCursor) {
			Cursor.show(this.stream);
		}
		// this.enabled = false;
		return this;
	}
	ok(text?:string) {
		return this.persist({symbol: LogSymbols.success, text});
	}
	succeed(text?:string) {
		return this.stopAndPersist({symbol: LogSymbols.success, text});
	}
	/*istanbul ignore next*/
	fail(text?:string) {
		return this.stopAndPersist({symbol: LogSymbols.error, text});
	}
	error(text?:string) {
		return this.persist({symbol: LogSymbols.error, text});
	}
	warn(text?:string) {
		return this.persist({symbol: LogSymbols.warning, text});
	}

	info(text?:string, newline:boolean=true) {
		return this.persist({symbol: LogSymbols.info, text}, newline ? '\n':'');
	}
	private persist(options:{ symbol:LogSymbols,text:string }, newline:string='\n') {
		/*istanbul ignore next*/
		if (!this.enabled) {
			return this;
		}
		this.clear();
		this.stream.write(`${options.symbol || /*istanbul ignore next*/' '} ${options.text || this.text}${newline}`);
		return this;
	}
	private stopAndPersist(options:{ symbol:LogSymbols,text:string }) {
		/*istanbul ignore next*/
		if (!this.enabled) {
			return this;
		}
		this.stop();
		this.stream.write(`${options.symbol || /*istanbul ignore next*/ ' '} ${options.text || /*istanbul ignore next*/this.text}\n`);

		return this;
	}
}
/** @ignore */
export let MainSpinner = new Spinner({text:''});
export function cliSpinner (options:ISpinnerOptions) {
    MainSpinner = new Spinner(options);
}
export function wait(time:number=1000) {
	return new Promise((resolve)=>{
		setTimeout(resolve, time);
	});
}
export async function spin(display:string | ISpinnerOptions, fn:() => Promise<string|void>) : Promise<string|void> {
	MainSpinner.text = display;
	MainSpinner.start();
	return fn().then(success => {
		if(success){
			MainSpinner.succeed(success);
			return success;
		} else {
			MainSpinner.stop();
		}
	}).catch( /*istanbul ignore next*/ err=>{
		MainSpinner.fail(`${MainSpinner.text}: ${err.message}`);
		// console.error(err.stack);
		throw err;
	});
}
