import { join } from "path";

export function cliPath (...path:string[]) {
    return join(process.env.MCE_ROOT, ...path);
}
export function targetPath (...path:string[]) {
    return join(process.cwd(), ...path);
}