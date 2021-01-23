import { existsSync } from '../mockable/fs'
import { spin } from '../spinner'
import { remove } from '../tree-maker'
import { confirm } from './confirm'

export async function override(display: string, testdir: string,  state: boolean) {
    if( existsSync(testdir) && !state ) {
        state = true
        if ( !await confirm(display) ) return false
    }
    /*istanbul ignore else*/
    if ( state ) {
        await spin('Cleanig path', async () => {
            remove(testdir)
        })
    }
    return true
}