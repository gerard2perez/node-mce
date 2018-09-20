/**
 * @module @bitsun/mce/utils
 */
import * as fs from 'fs';

export function remove (path) {
    // istanbul ignore else
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                remove(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};