import {question} from './question';
export async function confirm (text:string) {
    return ['y','yes','Yes','Y'].includes(await question(`${text}? [y/n]:`));
}