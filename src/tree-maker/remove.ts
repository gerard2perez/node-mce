import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from '../fs';
// istanbul ignore next
export function remove (path:string) {
    if (existsSync(path)) {
        readdirSync(path).forEach(function(file){
            var curPath = path + "/" + file;
            if (lstatSync(curPath).isDirectory()) { // recurse
                remove(curPath);
            } else { // delete file
                unlinkSync(curPath);
            }
        });
        rmdirSync(path);
    }
};