import { resolve } from "path";

export function cliPath (...path:string[]) {
    return resolve(process.env.MCE_ROOT, ...path);
}
export function targetPath (...path:string[]) {
    return resolve(process.cwd(), ...path);
}