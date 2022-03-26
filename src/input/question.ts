import { createInterface, moveCursor } from 'readline'
import { write, MainSpinner } from '../output'
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
		write`{info|sy} ${MainSpinner.text} - `
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