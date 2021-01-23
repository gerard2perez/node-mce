import { iter } from '../@utils/iter'
import { readFileSync, writeFileSync } from '../mockable/fs'

export function render(source: string, data: unknown, dest?: string ) {
    let info = readFileSync(source, 'utf-8')
    for(const [key, value] of iter(data)) {
        info = info.replace(new RegExp(`{{${key}}}`, 'gm'), value)
	}
    if( dest ) {
        writeFileSync(dest, info)
        return dest
    }
    return info
} 