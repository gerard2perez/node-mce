import { createInterface, moveCursor } from "readline";
import { MainSpinner } from "../spinner";
import { main_input } from "../system-streams";
export function question (display:string) : Promise<string> {
    const rl = createInterface({
        input: main_input,
        output: MainSpinner.stream,
        terminal: false
    });
    let SpinnerWorking = MainSpinner.isSpinning;
    if (SpinnerWorking) {
        MainSpinner.stop();
        MainSpinner.info(`${MainSpinner.text} - `, false);
    }
    return new Promise(resolve => rl.question(`${display} `, (awser)=>{
        moveCursor(MainSpinner.stream, 0, -1);
        MainSpinner.clear();
        if ( SpinnerWorking ) {
            MainSpinner.start();
        }
		rl.close();
		resolve(awser);
    }));
}