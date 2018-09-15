import { OptionKind } from "./options";

export class Argument {
    kind:OptionKind = OptionKind.optional;
    parser:any
    type:string
    name:string
    static parser = {
        string: o=>o,
        number: function  (o) {
            let res = parseFloat(o);
            if(isNaN(res)) {
                throw new Error(`Argument type missmatch. argument '${this.name}' is not a ${this.type}`);
            }
            return res;
        },
        bool: function  (o) {
            let res = o === 'true' || o === 'false';
            if(!res) {
                throw new Error(`Argument type missmatch. argument '${this.name}' is not a ${this.type}`);
            }
            return o === 'true';
        }
    }
    constructor(arg: string) {
        if (arg.includes('<')) this.kind = OptionKind.required;
        if (arg.includes('...')) this.kind = OptionKind.varidac;
        let name = arg.replace(/[<>.\[\]]/g, '');
        this.type = name.split(':')[1] || 'string';
        name = name.split(':')[0];
        this.name = name;
        this.parser = Argument.parser[this.type];
    }
}