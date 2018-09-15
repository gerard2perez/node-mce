import { createInterface, cursorTo, moveCursor } from "readline";
import { MainSpinner } from "./spinner";

function verbose(lvl:number, fn:string, text:string) {
    if( parseInt(process.env.MCE_VERBOSE) >= lvl)
        MainSpinner[fn](text)
}
export const info = verbose.bind(null,2,'info');
export const warn = verbose.bind(null,1,'warn');
export const error = (text:string)=>{
    MainSpinner.error(text);
}
export const ok = (text:string)=>{
    MainSpinner.ok(text);
}

export const pause = () => {
    MainSpinner.stop();
}

export const resume = () => {
    MainSpinner.start();
}

export function updateTextSpin(text:string) {
    MainSpinner.text = text;
}
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