import { createInterface, cursorTo, moveCursor } from "readline";
import { MainSpinner } from "./spinner";

export function input (display:string) : Promise<string> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    let SpinnerWorking = MainSpinner.isSpinning;
    if (SpinnerWorking) {
        MainSpinner.stop();
        MainSpinner.info(`${MainSpinner.text} - `, false);
    }
    return new Promise(resolve => rl.question(`${display} `, (awser)=>{
        moveCursor(process.stdout, 0, -1);
        MainSpinner.clear();
        if ( SpinnerWorking ) {
            MainSpinner.start();
        }
        rl.close();
        resolve(awser);
    }));
}
export async function ask (question:string) {
    return ['y','yes','Yes','Y'].includes(await input(`${question}? [y/n]:`));
}