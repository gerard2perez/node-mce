import { createInterface, moveCursor } from 'readline'
import { MainSpinner } from '../spinner'
import { streams } from '../system-streams'
export function question (display: string): Promise<string> {
    const rl = createInterface({
        input: streams.input,
        output: streams.output,
        terminal: false
    })
    const SpinnerWorking = MainSpinner.isSpinning
    if (SpinnerWorking) {
        MainSpinner.stop()
        MainSpinner.info(`${MainSpinner.text} - `, false)
    }
    return new Promise(resolve => rl.question(`${display} `, (answer) => {
        moveCursor(streams.output, 0, -1)
        MainSpinner.clear()
        if ( SpinnerWorking ) {
            MainSpinner.start()
        }
		rl.close()
		resolve(answer)
    }))
}