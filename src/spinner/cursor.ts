/**
 * @module @gerard2p/mce/spinner
 */
import * as signalExit from 'signal-exit';
export class Cursor {
    static hidden:boolean = false;
    static showOnExit:boolean = false;
    static show (stream:any) {

		const s = stream || /*istanbul ignore next*/ process.stderr;
		/*istanbul ignore next*/
        if (!s.isTTY) {
            return;
        }
        Cursor.hidden = false;
        s.write('\u001b[?25h');
    }
    static hide(stream:any) {
		const s = stream || /*istanbul ignore next*/process.stderr;
		/*istanbul ignore next*/
        if (!s.isTTY) {
            return;
        }
        if(!Cursor.showOnExit) {
			Cursor.showOnExit = true;
			/*istanbul ignore next*/
            signalExit(() => {
                process.stderr.write('\u001b[?25h');
            }, {alwaysLast: true});
        }
        Cursor.hidden = true;
        s.write('\u001b[?25l');
    };
}