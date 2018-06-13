import { readFileSync, writeFileSync } from "fs";

export function render(source:string, data:object, dest?:string ) {
    let info = readFileSync(source, 'utf-8');
    for(const [key, value] of data) {
        info = info.replace(new RegExp(`{{${key}}}`, 'gm'), value);
    }
    if( dest ) {
        writeFileSync(dest, info);
        return dest;
    }
    return info;
} 