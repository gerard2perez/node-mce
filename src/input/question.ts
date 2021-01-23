import { createInterface, moveCursor } from 'readline'
import { log } from '../console'
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
		log(-1, false)`{info|sy} ${MainSpinner.text} - `
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