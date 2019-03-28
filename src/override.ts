/**
 * @module @gerard2p/mce/utils
 */
import { existsSync } from "fs";
import { remove } from "./remove";
import { spin } from "./spinner";
import { ask } from "./console";

export async function override(text:string, testdir:string,  state:boolean) {
    if( existsSync(testdir) && !state ) {
        state = true;
        if ( !await ask(text) ) return false;
    }
    /*istanbul ignore else*/
    if ( state ) {
        await spin('Cleanig path', async () => {
            remove(testdir);
        });
    }
    return true;
}